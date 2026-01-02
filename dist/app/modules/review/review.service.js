"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = __importDefault(require("../../errors/apiError"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const insertIntoDB = async (user, payload) => {
    const patientData = await prisma_1.default.patient.findUniqueOrThrow({ where: { email: user.email } });
    const appointmentData = await prisma_1.default.appointment.findUniqueOrThrow({ where: { id: payload.appointmentId } });
    if (patientData.id !== appointmentData.patientId) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, "This is not your appointment!");
    }
    return await prisma_1.default.$transaction(async (tnx) => {
        const result = await tnx.review.create({
            data: {
                appointmentId: appointmentData.id,
                doctorId: appointmentData.doctorId,
                patientId: appointmentData.patientId,
                rating: payload.rating,
                comment: payload.comment,
            },
        });
        const avgRating = await tnx.review.aggregate({ _avg: { rating: true }, where: { doctorId: appointmentData.doctorId } });
        await tnx.doctor.update({ where: { id: appointmentData.doctorId }, data: { averageRating: avgRating._avg.rating } });
        return result;
    });
};
const getAllFromDB = async (filters, options) => {
    const { limit, page } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { patientEmail, doctorEmail } = filters;
    const andConditions = [];
    if (patientEmail)
        andConditions.push({ patient: { email: patientEmail } });
    if (doctorEmail)
        andConditions.push({ doctor: { email: doctorEmail } });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.review.findMany({
        where: whereConditions,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { createdAt: "desc" },
        include: { doctor: true, patient: true },
    });
    const total = await prisma_1.default.review.count({ where: whereConditions });
    return { meta: { total, page, limit }, data: result };
};
exports.ReviewService = { insertIntoDB, getAllFromDB };
//# sourceMappingURL=review.service.js.map