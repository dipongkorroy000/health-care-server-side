"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../helper/fileUploader");
const paginationHelper_1 = require("../../helper/paginationHelper");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createPatient = async (payload, file) => {
    if (file) {
        const uploadResult = await fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.patient.profilePhoto = uploadResult?.secure_url;
    }
    const hashPass = await bcryptjs_1.default.hash(payload.password, 10);
    const result = await prisma_1.default.$transaction(async (tnx) => {
        await tnx.user.create({ data: { email: payload.patient.email, password: hashPass, needPasswordChange: false } });
        return await tnx.patient.create({ data: payload.patient });
    });
    return result;
};
const getAllUser = async (filters, options) => {
    const { searchTerm, ...filterData } = filters;
    const { page, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({ OR: ["email"].map((field) => ({ [field]: { contains: searchTerm, mode: "insensitive" } })) });
    }
    if (Object.keys(filterData.length > 0)) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({ [key]: { equals: filterData[key] } })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { AND: whereConditions },
        orderBy: sortOrder && sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        select: { id: true, email: true, role: true, status: true, needPasswordChange: true },
    });
    const total = await prisma_1.default.user.count({ where: { AND: andConditions } });
    return {
        meta: { page, limit, total },
        data: result,
    };
};
const createDoctor = async (payload, file) => {
    if (file) {
        const uploadResult = await fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.doctor.profilePhoto = uploadResult?.secure_url;
    }
    const hashedPassword = await bcryptjs_1.default.hash(payload.password, 10);
    // update this
    const { specialties, ...doctorData } = payload.doctor;
    const result = await prisma_1.default.$transaction(async (tnx) => {
        await tnx.user.create({ data: { email: payload.doctor.email, password: hashedPassword, role: client_1.UserRole.DOCTOR } });
        const createdDoctorData = await tnx.doctor.create({ data: doctorData });
        // Step 3: Create doctor specialties if provided
        if (specialties && Array.isArray(specialties) && specialties.length > 0) {
            // Verify all specialties exist
            const existingSpecialties = await tnx.specialties.findMany({ where: { id: { in: specialties } }, select: { id: true } });
            const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
            const invalidSpecialties = specialties.filter((id) => !existingSpecialtyIds.includes(id));
            if (invalidSpecialties.length > 0)
                throw new Error(`Invalid specialty IDs: ${invalidSpecialties.join(", ")}`);
            // Create doctor specialties relations
            const doctorSpecialtiesData = specialties.map((specialtyId) => ({ doctorId: createdDoctorData.id, specialtiesId: specialtyId }));
            await tnx.doctorSpecialties.createMany({ data: doctorSpecialtiesData });
        }
        // Step 4: Return doctor with specialties
        return await tnx.doctor.findUnique({
            where: { id: createdDoctorData.id },
            include: { doctorSpecialties: { include: { specialties: true } } },
        });
    });
    return result;
};
const createAdmin = async (payload, file) => {
    if (file) {
        const uploadResult = await fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.admin.profilePhoto = uploadResult?.secure_url;
    }
    const hashedPassword = await bcryptjs_1.default.hash(payload.password, 10);
    const result = await prisma_1.default.$transaction(async (tnx) => {
        await tnx.user.create({
            data: { email: payload.admin.email, password: hashedPassword, role: client_1.UserRole.ADMIN },
        });
        const createdAdminData = await tnx.admin.create({ data: payload.admin });
        return createdAdminData;
    });
    return result;
};
const getMyProfile = async (user) => {
    const userInfo = await prisma_1.default.user.findUniqueOrThrow({
        where: { email: user.email, status: client_1.UserStatus.ACTIVE },
        select: { id: true, email: true, needPasswordChange: true, role: true, status: true },
    });
    let profileData;
    if (userInfo.role === client_1.UserRole.PATIENT) {
        profileData = await prisma_1.default.patient.findUnique({ where: { email: userInfo.email } });
    }
    else if (userInfo.role === client_1.UserRole.DOCTOR) {
        profileData = await prisma_1.default.doctor.findUnique({ where: { email: userInfo.email } });
    }
    else if (userInfo.role === client_1.UserRole.ADMIN) {
        profileData = await prisma_1.default.admin.findUnique({ where: { email: userInfo.email } });
    }
    return { ...userInfo, ...profileData };
};
const changeProfileStatus = async (id, payload) => {
    await prisma_1.default.user.findUniqueOrThrow({ where: { id } });
    return await prisma_1.default.user.update({ where: { id }, data: payload });
};
const updateMyProfile = async (user, payload, file) => {
    const userInfo = await prisma_1.default.user.findUniqueOrThrow({ where: { email: user?.email, status: client_1.UserStatus.ACTIVE } });
    if (file) {
        const uploadToCloudinary = await fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.profilePhoto = uploadToCloudinary?.secure_url;
    }
    let profileInfo;
    if (userInfo.role === client_1.UserRole.ADMIN) {
        profileInfo = await prisma_1.default.admin.update({ where: { email: userInfo.email }, data: payload });
    }
    else if (userInfo.role === client_1.UserRole.DOCTOR) {
        profileInfo = await prisma_1.default.doctor.update({ where: { email: userInfo.email }, data: payload });
    }
    else if (userInfo.role === client_1.UserRole.PATIENT) {
        profileInfo = await prisma_1.default.patient.update({ where: { email: userInfo.email }, data: payload });
    }
    return { ...profileInfo };
};
exports.UserService = { createPatient, getAllUser, createDoctor, createAdmin, getMyProfile, changeProfileStatus, updateMyProfile };
//# sourceMappingURL=user.service.js.map