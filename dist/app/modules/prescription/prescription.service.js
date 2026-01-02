"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = __importDefault(require("../../errors/apiError"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createPrescription = async (user, payload) => {
    const appointmentData = await prisma_1.default.appointment.findUniqueOrThrow({
        where: { id: payload.appointmentId, status: client_1.AppointmentStatus.COMPLETED, paymentStatus: client_1.PaymentStatus.PAID },
        include: { doctor: true },
    });
    if (user.role === client_1.UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email))
            throw new apiError_1.default(http_status_1.default.BAD_REQUEST, "This is not your appointment");
    }
    return await prisma_1.default.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions,
            followUpDate: payload.followUpDate || null,
        },
        include: { patient: true },
    });
};
const patientPrescription = async (user, options) => {
    const { limit, page, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = await prisma_1.default.prescription.findMany({
        where: { patient: { email: user.email } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { doctor: true, patient: true, appointment: true },
    });
    const total = await prisma_1.default.prescription.count({ where: { patient: { email: user.email } } });
    return { meta: { total, page, limit }, data: result };
};
// get my prescription as a patient
exports.PrescriptionService = { createPrescription, patientPrescription };
//# sourceMappingURL=prescription.service.js.map