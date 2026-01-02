import {Doctor, Prisma, UserStatus} from "@prisma/client";
import {IPaginationOptions, paginationHelper} from "../../helper/paginationHelper";
import prisma from "../../shared/prisma";
import {IDoctorFilterRequest, IDoctorUpdateInput} from "./doctor.interface";
import ApiError from "../../errors/apiError";
import status from "http-status";
import {openai} from "../../helper/open-router";
import {extractJsonFromMessage} from "../../helper/extractJsonFromMessage";

const getAllFromDB = async (filters: IDoctorFilterRequest, options: IPaginationOptions) => {
  const {page, limit, sortBy, sortOrder} = paginationHelper.calculatePagination(options);
  const {searchTerm, specialties, ...filterData} = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["name", "email", "contactNumber"].map((field) => ({[field]: {contains: searchTerm, mode: "insensitive"}})),
    });
  }

  // "", "medicine"
  if (specialties && specialties.length > 0) {
    // Convert to array if single string
    const specialtiesArray = Array.isArray(specialties) ? specialties : [specialties];

    andConditions.push({
      doctorSpecialties: {
        some: {specialties: {title: {in: specialtiesArray, mode: "insensitive"}}},
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {equals: (filterData as any)[key]},
    }));

    andConditions.push(...filterConditions);
  }

  andConditions.push({isDeleted: false});

  const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? {AND: andConditions} : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {[sortBy]: sortOrder},
    include: {
      doctorSpecialties: {include: {specialties: true}},
      doctorSchedules: {include: {schedule: true}},
      reviews: true,
    },
  });

  const total = await prisma.doctor.count({where: whereConditions});

  return {meta: {total, page, limit}, data: result};
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  return await prisma.doctor.findUnique({
    where: {id, isDeleted: false},
    include: {
      doctorSpecialties: {include: {specialties: true}},
      doctorSchedules: {include: {schedule: true}},
      reviews: true,
    },
  });
};

const updateIntoDB = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({where: {id, isDeleted: false}});

  const {specialties, removeSpecialties, ...doctorData} = payload;

  await prisma.$transaction(async (tnx) => {
    // Step 1: Update doctor basic data
    if (Object.keys(doctorData).length > 0) await tnx.doctor.update({where: {id}, data: doctorData});

    // Step 2: Remove specialties if provided
    if (removeSpecialties && Array.isArray(removeSpecialties) && removeSpecialties.length > 0) {
      // Validate that specialties to remove exist for this doctor
      const existingDoctorSpecialties = await tnx.doctorSpecialties.findMany({
        where: {doctorId: doctorInfo.id, specialtiesId: {in: removeSpecialties}},
      });

      if (existingDoctorSpecialties.length !== removeSpecialties.length) {
        const foundIds = existingDoctorSpecialties.map((ds) => ds.specialtiesId);

        const notFound = removeSpecialties.filter((id) => !foundIds.includes(id));

        throw new Error(`Cannot remove non-existent specialties: ${notFound.join(", ")}`);
      }

      // Delete the specialties
      await tnx.doctorSpecialties.deleteMany({where: {doctorId: doctorInfo.id, specialtiesId: {in: removeSpecialties}}});
    }

    // Step 3: Add new specialties if provided
    if (specialties && Array.isArray(specialties) && specialties.length > 0) {
      // Verify all specialties exist in Specialties table
      const existingSpecialties = await tnx.specialties.findMany({where: {id: {in: specialties}}, select: {id: true}});

      const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
      const invalidSpecialties = specialties.filter((id) => !existingSpecialtyIds.includes(id));

      if (invalidSpecialties.length > 0) throw new Error(`Invalid specialty IDs: ${invalidSpecialties.join(", ")}`);

      // Check for duplicates - don't add specialties that already exist
      const currentDoctorSpecialties = await tnx.doctorSpecialties.findMany({
        where: {doctorId: doctorInfo.id, specialtiesId: {in: specialties}},
        select: {specialtiesId: true},
      });

      const currentSpecialtyIds = currentDoctorSpecialties.map((ds) => ds.specialtiesId);
      const newSpecialties = specialties.filter((id) => !currentSpecialtyIds.includes(id));

      // Only create new specialties that don't already exist
      if (newSpecialties.length > 0) {
        const doctorSpecialtiesData = newSpecialties.map((specialtyId) => ({doctorId: doctorInfo.id, specialtiesId: specialtyId}));

        await tnx.doctorSpecialties.createMany({data: doctorSpecialtiesData});
      }
    }
  });

  // Step 4: Return updated doctor with specialties
  const result = await prisma.doctor.findUnique({
    where: {id: doctorInfo.id},
    include: {doctorSpecialties: {include: {specialties: true}}},
  });

  return result;

  // -----------
  // if (specialties && specialties.length > 0) {
  //   const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted);

  //   for (const specialty of deleteSpecialtyIds) {
  //     await tnx.doctorSpecialties.deleteMany({where: {doctorId: id, specialtiesId: specialty.specialtyId}});
  //   }

  //   const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted);

  //   for (const specialty of createSpecialtyIds) {
  //     await tnx.doctorSpecialties.create({data: {doctorId: id, specialtiesId: specialty.specialtyId}});
  //   }
  // }

  // return await tnx.doctor.update({
  //   where: {id: doctorInfo.id},
  //   data: doctorData,
  //   include: {doctorSpecialties: {include: {specialties: true}}},
  // });
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({where: {id}});

    await transactionClient.user.delete({where: {email: deleteDoctor.email}});

    return deleteDoctor;
  });
};

const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({where: {id}, data: {isDeleted: true}});

    await transactionClient.user.update({
      where: {email: deleteDoctor.email},
      data: {status: UserStatus.DELETED},
    });

    return deleteDoctor;
  });
};

const getAISuggestions = async (payload: {symptoms: string}) => {
  if (!(payload && payload.symptoms)) throw new ApiError(status.BAD_REQUEST, "symptoms is required!");

  const doctors = await prisma.doctor.findMany({
    where: {isDeleted: false},
    include: {doctorSpecialties: {include: {specialties: true}}},
  });

  const prompt = `
  You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors. 
  Each doctor has specialties and years of experience. 
  Only suggest doctors who are relevant to the given symptoms. 
  Symptoms: ${payload.symptoms} Here is the doctor list (in JSON):
  ${JSON.stringify(doctors, null, 2)} 
  Return your response in JSON format with full individual doctor data.`;

  console.log("analyzing......\n");

  const completion = await openai.chat.completions.create({
    model: "z-ai/glm-4.5-air:free",
    messages: [
      {
        role: "system",
        content: "You are a helpful AI medical assistant that provides doctor suggestions.",
      },
      {role: "user", content: prompt},
    ],
  });

  return await extractJsonFromMessage(completion.choices[0]?.message);
};

export const DoctorService = {getAllFromDB, updateIntoDB, getByIdFromDB, deleteFromDB, softDelete, getAISuggestions};
