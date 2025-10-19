import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";
import { Prisma, Specialties } from "@prisma/client";
import { createSpecialty } from "./specialties.interface";

const insertIntoDB = async (payload: createSpecialty, file: Express.Multer.File | undefined) => {
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    payload.icon = uploadToCloudinary?.secure_url ?? "";
  }

  // Ensure icon is at least an empty string to satisfy Prisma's non-nullable field
  if (!payload.icon) payload.icon = "";

  return await prisma.specialties.create({ data: payload });
};

const getAllFromDB = async (): Promise<Specialties[]> => {
  return await prisma.specialties.findMany();
};

const deleteFromDB = async (id: string): Promise<Specialties> => {
  return await prisma.specialties.delete({ where: { id } });
};

export const SpecialtiesService = { insertIntoDB, getAllFromDB, deleteFromDB };
