import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { page, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["name", "email", "contactNumber"].map((field) => ({ [field]: { contains: searchTerm, mode: "insensitive" } })),
    });
  }

  // "", "medicine"
  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: { specialties: { title: { contains: specialties, mode: "insensitive" } } },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: { equals: (filterData as any)[key] },
    }));

    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: { doctorSpecialties: { include: { specialties: true } } }, // doctor specialties showing 
  });

  const total = await prisma.doctor.count({ where: whereConditions });

  return { meta: { total, page, limit }, data: result };
};

const updateIntoDB = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({ where: { id } });

  const { specialties, ...doctorData } = payload;

  return await prisma.$transaction(async (tnx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted);

      for (const specialty of deleteSpecialtyIds) {
        await tnx.doctorSpecialties.deleteMany({ where: { doctorId: id, specialtiesId: specialty.specialtyId } });
      }

      const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted);

      for (const specialty of createSpecialtyIds) {
        await tnx.doctorSpecialties.create({ data: { doctorId: id, specialtiesId: specialty.specialtyId } });
      }
    }

    return await tnx.doctor.update({
      where: { id: doctorInfo.id },
      data: doctorData,
      include: { doctorSpecialties: { include: { specialties: true } } },
    });
  });
};

export const DoctorService = { getAllFromDB, updateIntoDB };
