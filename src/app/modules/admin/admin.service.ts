import {Admin, Prisma, UserStatus} from "@prisma/client";
import {IAdminFilterRequest} from "./admin.interface";
import {IPaginationOptions, paginationHelper} from "../../helper/paginationHelper";
import prisma from "../../shared/prisma";

const getAllFromDB = async (params: IAdminFilterRequest, options: IPaginationOptions) => {
  const {page, limit} = paginationHelper.calculatePagination(options);
  const {searchTerm, ...filterData} = params;

  const andConditions: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: ["name", "email", "contactNumber"].map((field) => ({
        [field]: {contains: params.searchTerm, mode: "insensitive"},
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {equals: (filterData as any)[key]},
      })),
    });
  }

  andConditions.push({isDeleted: false});

  //console.dir(andConditions, { depth: 'infinity' })
  const whereConditions: Prisma.AdminWhereInput = {AND: andConditions};

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: options.sortBy && options.sortOrder ? {[options.sortBy]: options.sortOrder} : {createdAt: "desc"},
  });

  const total = await prisma.admin.count({where: whereConditions});

  return {meta: {page, limit, total}, data: result};
};

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({where: {id, isDeleted: false}});

  return result;
};

const updateIntoDB = async (id: string, data: Partial<Admin>): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({where: {id, isDeleted: false}});

  const result = await prisma.admin.update({where: {id}, data});

  return result;
};

const deleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({where: {id}});

  const result = await prisma.$transaction(async (tnx) => {
    const adminDeletedData = await tnx.admin.delete({where: {id}});

    await tnx.user.delete({where: {email: adminDeletedData.email}});

    return adminDeletedData;
  });

  return result;
};

const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({where: {id, isDeleted: false}});

  const result = await prisma.$transaction(async (tnx) => {
    const adminDeletedData = await tnx.admin.update({where: {id}, data: {isDeleted: true}});

    await tnx.user.update({where: {email: adminDeletedData.email}, data: {status: UserStatus.DELETED}});

    return adminDeletedData;
  });

  return result;
};

export const AdminService = {getAllFromDB, getByIdFromDB, updateIntoDB, deleteFromDB, softDeleteFromDB};
