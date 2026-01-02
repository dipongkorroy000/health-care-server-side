"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesService = void 0;
const fileUploader_1 = require("../../helper/fileUploader");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const insertIntoDB = async (payload, file) => {
    if (file) {
        const uploadToCloudinary = await fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.icon = uploadToCloudinary?.secure_url ?? "";
    }
    // Ensure icon is at least an empty string to satisfy Prisma's non-nullable field
    if (!payload.icon)
        payload.icon = "";
    return await prisma_1.default.specialties.create({ data: payload });
};
const getAllFromDB = async () => {
    return await prisma_1.default.specialties.findMany();
};
const deleteFromDB = async (id) => {
    return await prisma_1.default.specialties.delete({ where: { id } });
};
exports.SpecialtiesService = { insertIntoDB, getAllFromDB, deleteFromDB };
//# sourceMappingURL=specialties.service.js.map