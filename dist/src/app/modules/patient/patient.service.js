"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../helper/paginationHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllFromDB = async (filters, options) => {
    const { limit, page } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({ OR: ["name", "email", "contactNo"].map((field) => ({ [field]: { contains: searchTerm, mode: "insensitive" } })) });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return { [key]: { equals: filterData[key] } };
            }),
        });
    }
    andConditions.push({ isDeleted: false });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.patient.findMany({
        where: whereConditions,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { createdAt: "desc" },
    });
    const total = await prisma_1.default.patient.count({ where: whereConditions });
    return { meta: { total, page, limit }, data: result };
};
const getByIdFromDB = async (id) => {
    return await prisma_1.default.patient.findUnique({ where: { id, isDeleted: false } });
};
const softDelete = async (id) => {
    return await prisma_1.default.$transaction(async (transactionClient) => {
        const deletedPatient = await transactionClient.patient.update({ where: { id }, data: { isDeleted: true } });
        await transactionClient.user.update({ where: { email: deletedPatient.email }, data: { status: client_1.UserStatus.DELETED } });
        return deletedPatient;
    });
};
// PatientHealthData, MedicalReport, patient
const updateIntoDB = async (user, payload) => {
    const { medicalReport, patientHealthData, ...patientData } = payload;
    const patientInfo = await prisma_1.default.patient.findUniqueOrThrow({ where: { email: user.email, isDeleted: false } });
    return await prisma_1.default.$transaction(async (tnx) => {
        await tnx.patient.update({ where: { id: patientInfo.id }, data: patientData });
        if (patientHealthData) {
            await tnx.patientHealthData.upsert({
                where: { patientId: patientInfo.id },
                update: patientHealthData,
                create: { ...patientHealthData, patientId: patientInfo.id },
            });
        }
        if (medicalReport)
            await tnx.medicalReport.create({ data: { ...medicalReport, patientId: patientInfo.id } });
        return await tnx.patient.findUnique({
            where: { id: patientInfo.id },
            include: { patientHealthData: true, medicalReports: true },
        });
    });
};
exports.PatientService = { getAllFromDB, getByIdFromDB, softDelete, updateIntoDB };
//# sourceMappingURL=patient.service.js.map