import {Prisma, UserRole, UserStatus} from "@prisma/client";
import {fileUploader} from "../../helper/fileUploader";
import {IPaginationOptions, paginationHelper} from "../../helper/paginationHelper";
import {prisma} from "../../shared/prisma";
import {createAdminInput, createDoctorInput, createPatientInput} from "./user.interface";
import bcryptjs from "bcryptjs";
import {IJWTPayload} from "../../types/reqUser";

const createPatient = async (payload: createPatientInput, file: Express.Multer.File | undefined) => {
  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    payload.patient.profilePhoto = uploadResult?.secure_url as string;
  }

  const hashPass = await bcryptjs.hash(payload.password, 10);

  const result = await prisma.$transaction(async (transaction) => {
    await transaction.user.create({data: {email: payload.patient.email, password: hashPass}});

    return await transaction.patient.create({data: payload.patient});
  });

  return result;
};

const getAllUser = async (filters: any, options: IPaginationOptions) => {
  const {searchTerm, ...filterData} = filters;
  const {page, limit, sortBy, sortOrder} = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({OR: ["email"].map((field) => ({[field]: {contains: searchTerm, mode: "insensitive"}}))});
  }

  if (Object.keys(filterData.length > 0)) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({[key]: {equals: (filterData as any)[key]}})),
    });
  }

  const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {AND: andConditions} : {};

  const result = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {AND: whereConditions},

    orderBy: sortOrder && sortBy ? {[sortBy]: sortOrder} : {createdAt: "desc"},

    select: {id: true, email: true, role: true, status: true, needPasswordChange: true},
  });

  const total = await prisma.user.count({where: {AND: andConditions}});

  return {
    meta: {page, limit, total},
    data: result,
  };
};

const createDoctor = async (payload: createDoctorInput, file: Express.Multer.File | undefined) => {
  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    payload.doctor.profilePhoto = uploadResult?.secure_url as string;
  }

  const hashedPassword: string = await bcryptjs.hash(payload.password, 10);
  // update this
  const {specialties, ...doctorData} = payload.doctor;

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({data: {email: payload.doctor.email, password: hashedPassword, role: UserRole.DOCTOR}});

    const createdDoctorData = await tnx.doctor.create({data: doctorData});

    // Step 3: Create doctor specialties if provided
    if (specialties && Array.isArray(specialties) && specialties.length > 0) {
      // Verify all specialties exist
      const existingSpecialties = await tnx.specialties.findMany({where: {id: {in: specialties}}, select: {id: true}});

      const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
      const invalidSpecialties = specialties.filter((id) => !existingSpecialtyIds.includes(id));

      if (invalidSpecialties.length > 0) throw new Error(`Invalid specialty IDs: ${invalidSpecialties.join(", ")}`);

      // Create doctor specialties relations
      const doctorSpecialtiesData = specialties.map((specialtyId) => ({doctorId: createdDoctorData.id, specialtiesId: specialtyId}));

      await tnx.doctorSpecialties.createMany({data: doctorSpecialtiesData});
    }

    // Step 4: Return doctor with specialties
    return await tnx.doctor.findUnique({
      where: {id: createdDoctorData.id},
      include: {doctorSpecialties: {include: {specialties: true}}},
    });
  });

  return result;
};

const createAdmin = async (payload: createAdminInput, file: Express.Multer.File | undefined) => {
  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    payload.admin.profilePhoto = uploadResult?.secure_url as string;
  }

  const hashedPassword: string = await bcryptjs.hash(payload.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {email: payload.admin.email, password: hashedPassword, role: UserRole.ADMIN},
    });

    const createdAdminData = await tnx.admin.create({data: payload.admin});

    return createdAdminData;
  });

  return result;
};

const getMyProfile = async (user: IJWTPayload) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {email: user.email, status: UserStatus.ACTIVE},
    select: {id: true, email: true, needPasswordChange: true, role: true, status: true},
  });

  let profileData;

  if (userInfo.role === UserRole.PATIENT) {
    profileData = await prisma.patient.findUnique({where: {email: userInfo.email}});
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileData = await prisma.doctor.findUnique({where: {email: userInfo.email}});
  } else if (userInfo.role === UserRole.ADMIN) {
    profileData = await prisma.admin.findUnique({where: {email: userInfo.email}});
  }

  return {...userInfo, ...profileData};
};

const changeProfileStatus = async (id: string, payload: {status: UserStatus}) => {
  await prisma.user.findUniqueOrThrow({where: {id}});

  return await prisma.user.update({where: {id}, data: payload});
};

const updateMyProfile = async (user: IJWTPayload, payload: any, file: Express.Multer.File | undefined) => {
  const userInfo = await prisma.user.findUniqueOrThrow({where: {email: user?.email, status: UserStatus.ACTIVE}});

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    payload.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let profileInfo;

  if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({where: {email: userInfo.email}, data: payload});
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({where: {email: userInfo.email}, data: payload});
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({where: {email: userInfo.email}, data: payload});
  }

  return {...profileInfo};
};

export const UserService = {createPatient, getAllUser, createDoctor, createAdmin, getMyProfile, changeProfileStatus, updateMyProfile};
