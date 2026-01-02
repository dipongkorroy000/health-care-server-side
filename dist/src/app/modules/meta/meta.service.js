"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const apiError_1 = __importDefault(require("../../errors/apiError"));
const fetchDashboardMetaData = async (user) => {
    let metadata;
    switch (user.role) {
        case client_1.UserRole.ADMIN:
            metadata = await getAdminMetaData();
            break;
        case client_1.UserRole.DOCTOR:
            metadata = await getDoctorMetaData(user);
            break;
        case client_1.UserRole.PATIENT:
            metadata = await getPatientMetaData(user);
            break;
        default:
            throw new apiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid user role!");
    }
    return metadata;
};
const getDoctorMetaData = async (user) => {
    const doctorData = await prisma_1.default.doctor.findUniqueOrThrow({ where: { email: user?.email } });
    const appointmentCount = await prisma_1.default.appointment.count({ where: { doctorId: doctorData.id } });
    const patientCount = await prisma_1.default.appointment.groupBy({ by: ["patientId"], _count: { id: true } });
    const reviewCount = await prisma_1.default.review.count({ where: { doctorId: doctorData.id } });
    const totalRevenue = await prisma_1.default.payment.aggregate({
        _sum: { amount: true },
        where: { appointment: { doctorId: doctorData.id }, status: client_1.PaymentStatus.PAID },
    });
    const appointmentStatusDistribution = await prisma_1.default.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: { doctorId: doctorData.id },
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id),
    }));
    return { appointmentCount, reviewCount, patientCount: patientCount.length, totalRevenue, formattedAppointmentStatusDistribution };
};
const getPatientMetaData = async (user) => {
    const patientData = await prisma_1.default.patient.findUniqueOrThrow({ where: { email: user?.email } });
    const appointmentCount = await prisma_1.default.appointment.count({ where: { patientId: patientData.id } });
    const prescriptionCount = await prisma_1.default.prescription.count({ where: { patientId: patientData.id } });
    const reviewCount = await prisma_1.default.review.count({ where: { patientId: patientData.id } });
    const appointmentStatusDistribution = await prisma_1.default.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: { patientId: patientData.id },
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id),
    }));
    return { appointmentCount, prescriptionCount, reviewCount, formattedAppointmentStatusDistribution };
};
const getAdminMetaData = async () => {
    const patientCount = await prisma_1.default.patient.count();
    const doctorCount = await prisma_1.default.doctor.count();
    const adminCount = await prisma_1.default.admin.count();
    const appointmentCount = await prisma_1.default.appointment.count();
    const paymentCount = await prisma_1.default.payment.count();
    const totalRevenue = await prisma_1.default.payment.aggregate({ _sum: { amount: true }, where: { status: client_1.PaymentStatus.PAID } });
    const barChartData = await getBarChartData();
    const pieChartData = await getPieChartData();
    return { patientCount, doctorCount, adminCount, appointmentCount, paymentCount, totalRevenue, barChartData, pieChartData };
};
const getBarChartData = async () => {
    const appointmentCountPerMonth = await prisma_1.default.$queryRaw `
        SELECT DATE_TRUNC('month', "createdAt") AS month,
        CAST(COUNT(*) AS INTEGER) AS count
        FROM "appointments"
        GROUP BY month
        ORDER BY month ASC
    `;
    return appointmentCountPerMonth;
};
const getPieChartData = async () => {
    const appointmentStatusDistribution = await prisma_1.default.appointment.groupBy({ by: ["status"], _count: { id: true } });
    return appointmentStatusDistribution.map(({ status, _count }) => ({ status, count: Number(_count.id) }));
};
exports.MetaService = { fetchDashboardMetaData };
//# sourceMappingURL=meta.service.js.map