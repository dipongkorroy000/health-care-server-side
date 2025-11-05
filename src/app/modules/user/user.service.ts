import { Prisma, UserRole } from "@prisma/client";
import { fileUploader } from "../../helper/fileUploader";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";
import { createAdminInput, createDoctorInput, createPatientInput } from "./user.interface";
import bcryptjs from "bcryptjs";

const createPatient = async (payload: createPatientInput, file: Express.Multer.File | undefined) => {
  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    payload.patient.profilePhoto = uploadResult?.secure_url as string;
  }

  const hashPass = await bcryptjs.hash(payload.password, 10);

  const result = await prisma.$transaction(async (transaction) => {
    await transaction.user.create({ data: { email: payload.patient.email, password: hashPass } });

    return await transaction.patient.create({ data: payload.patient });
  });

  return result;
};

const getAllUser = async (filters: any, options: IOptions) => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({ OR: ["email"].map((field) => ({ [field]: { contains: searchTerm, mode: "insensitive" } })) });
  }

  if (Object.keys(filterData.length > 0)) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({ [key]: { equals: (filterData as any)[key] } })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: { AND: whereConditions },

    orderBy: sortOrder && sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },

    select: { id: true, email: true, role: true, status: true, needPasswordChange: true },
  });

  const total = await prisma.user.count({ where: { AND: andConditions } });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const createDoctor = async (payload: createDoctorInput, file: Express.Multer.File | undefined) => {
  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    payload.doctor.profilePhoto = uploadResult?.secure_url as string;
  }

  const hashedPassword: string = await bcryptjs.hash(payload.password, 10);

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: { email: payload.doctor.email, password: hashedPassword, role: UserRole.DOCTOR },
    });

    const createdDoctorData = await transactionClient.doctor.create({ data: payload.doctor });

    return createdDoctorData;
  });

  return result;
};

const createAdmin = async (payload: createAdminInput, file: Express.Multer.File | undefined) => {
  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    payload.admin.profilePhoto = uploadResult?.secure_url as string;
  }

  const hashedPassword: string = await bcryptjs.hash(payload.password, 10);

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: { email: payload.admin.email, password: hashedPassword, role: UserRole.ADMIN },
    });

    const createdAdminData = await transactionClient.admin.create({ data: payload.admin });

    return createdAdminData;
  });

  return result;
};

export const UserService = { createPatient, getAllUser, createDoctor, createAdmin };
