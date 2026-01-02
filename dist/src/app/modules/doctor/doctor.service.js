"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../helper/paginationHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const apiError_1 = __importDefault(require("../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const open_router_1 = require("../../helper/open-router");
const extractJsonFromMessage_1 = require("../../helper/extractJsonFromMessage");
const getAllFromDB = async (filters, options) => {
    const { page, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: ["name", "email", "contactNumber"].map((field) => ({ [field]: { contains: searchTerm, mode: "insensitive" } })),
        });
    }
    // "", "medicine"
    if (specialties && specialties.length > 0) {
        // Convert to array if single string
        const specialtiesArray = Array.isArray(specialties) ? specialties : [specialties];
        andConditions.push({
            doctorSpecialties: {
                some: { specialties: { title: { in: specialtiesArray, mode: "insensitive" } } },
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: { equals: filterData[key] },
        }));
        andConditions.push(...filterConditions);
    }
    andConditions.push({ isDeleted: false });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.doctor.findMany({
        where: whereConditions,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            doctorSpecialties: { include: { specialties: true } },
            doctorSchedules: { include: { schedule: true } },
            reviews: true,
        },
    });
    const total = await prisma_1.default.doctor.count({ where: whereConditions });
    return { meta: { total, page, limit }, data: result };
};
const getByIdFromDB = async (id) => {
    return await prisma_1.default.doctor.findUnique({
        where: { id, isDeleted: false },
        include: {
            doctorSpecialties: { include: { specialties: true } },
            doctorSchedules: { include: { schedule: true } },
            reviews: true,
        },
    });
};
const updateIntoDB = async (id, payload) => {
    const doctorInfo = await prisma_1.default.doctor.findUniqueOrThrow({ where: { id, isDeleted: false } });
    const { specialties, removeSpecialties, ...doctorData } = payload;
    await prisma_1.default.$transaction(async (tnx) => {
        // Step 1: Update doctor basic data
        if (Object.keys(doctorData).length > 0)
            await tnx.doctor.update({ where: { id }, data: doctorData });
        // Step 2: Remove specialties if provided
        if (removeSpecialties && Array.isArray(removeSpecialties) && removeSpecialties.length > 0) {
            // Validate that specialties to remove exist for this doctor
            const existingDoctorSpecialties = await tnx.doctorSpecialties.findMany({
                where: { doctorId: doctorInfo.id, specialtiesId: { in: removeSpecialties } },
            });
            if (existingDoctorSpecialties.length !== removeSpecialties.length) {
                const foundIds = existingDoctorSpecialties.map((ds) => ds.specialtiesId);
                const notFound = removeSpecialties.filter((id) => !foundIds.includes(id));
                throw new Error(`Cannot remove non-existent specialties: ${notFound.join(", ")}`);
            }
            // Delete the specialties
            await tnx.doctorSpecialties.deleteMany({ where: { doctorId: doctorInfo.id, specialtiesId: { in: removeSpecialties } } });
        }
        // Step 3: Add new specialties if provided
        if (specialties && Array.isArray(specialties) && specialties.length > 0) {
            // Verify all specialties exist in Specialties table
            const existingSpecialties = await tnx.specialties.findMany({ where: { id: { in: specialties } }, select: { id: true } });
            const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
            const invalidSpecialties = specialties.filter((id) => !existingSpecialtyIds.includes(id));
            if (invalidSpecialties.length > 0)
                throw new Error(`Invalid specialty IDs: ${invalidSpecialties.join(", ")}`);
            // Check for duplicates - don't add specialties that already exist
            const currentDoctorSpecialties = await tnx.doctorSpecialties.findMany({
                where: { doctorId: doctorInfo.id, specialtiesId: { in: specialties } },
                select: { specialtiesId: true },
            });
            const currentSpecialtyIds = currentDoctorSpecialties.map((ds) => ds.specialtiesId);
            const newSpecialties = specialties.filter((id) => !currentSpecialtyIds.includes(id));
            // Only create new specialties that don't already exist
            if (newSpecialties.length > 0) {
                const doctorSpecialtiesData = newSpecialties.map((specialtyId) => ({ doctorId: doctorInfo.id, specialtiesId: specialtyId }));
                await tnx.doctorSpecialties.createMany({ data: doctorSpecialtiesData });
            }
        }
    });
    // Step 4: Return updated doctor with specialties
    const result = await prisma_1.default.doctor.findUnique({
        where: { id: doctorInfo.id },
        include: { doctorSpecialties: { include: { specialties: true } } },
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
const deleteFromDB = async (id) => {
    return await prisma_1.default.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.delete({ where: { id } });
        await transactionClient.user.delete({ where: { email: deleteDoctor.email } });
        return deleteDoctor;
    });
};
const softDelete = async (id) => {
    return await prisma_1.default.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.update({ where: { id }, data: { isDeleted: true } });
        await transactionClient.user.update({
            where: { email: deleteDoctor.email },
            data: { status: client_1.UserStatus.DELETED },
        });
        return deleteDoctor;
    });
};
const getAISuggestions = async (payload) => {
    if (!(payload && payload.symptoms))
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, "symptoms is required!");
    const doctors = await prisma_1.default.doctor.findMany({
        where: { isDeleted: false },
        include: { doctorSpecialties: { include: { specialties: true } } },
    });
    const prompt = `
  You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors. 
  Each doctor has specialties and years of experience. 
  Only suggest doctors who are relevant to the given symptoms. 
  Symptoms: ${payload.symptoms} Here is the doctor list (in JSON):
  ${JSON.stringify(doctors, null, 2)} 
  Return your response in JSON format with full individual doctor data.`;
    console.log("analyzing......\n");
    const completion = await open_router_1.openai.chat.completions.create({
        model: "z-ai/glm-4.5-air:free",
        messages: [
            {
                role: "system",
                content: "You are a helpful AI medical assistant that provides doctor suggestions.",
            },
            { role: "user", content: prompt },
        ],
    });
    return await (0, extractJsonFromMessage_1.extractJsonFromMessage)(completion.choices[0]?.message);
};
exports.DoctorService = { getAllFromDB, updateIntoDB, getByIdFromDB, deleteFromDB, softDelete, getAISuggestions };
//# sourceMappingURL=doctor.service.js.map