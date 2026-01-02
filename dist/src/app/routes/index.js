"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const schedule_route_1 = require("../modules/schedule/schedule.route");
const doctorSchedules_route_1 = require("../modules/doctorSchedules/doctorSchedules.route");
const specialties_route_1 = require("../modules/specialties/specialties.route");
const doctor_route_1 = require("../modules/doctor/doctor.route");
const appointment_route_1 = require("../modules/appointment/appointment.route");
const prescription_route_1 = require("../modules/prescription/prescription.route");
const review_route_1 = require("../modules/review/review.route");
const patient_route_1 = require("../modules/patient/patient.route");
const meta_route_1 = require("../modules/meta/meta.route");
const admin_route_1 = require("../modules/admin/admin.route");
const router = express_1.default.Router();
const moduleRoutes = [
    { path: "/user", route: user_route_1.userRoutes },
    { path: "/auth", route: auth_route_1.authRoutes },
    { path: "/schedule", route: schedule_route_1.scheduleRoutes },
    { path: "/doctor-schedule", route: doctorSchedules_route_1.doctorScheduleRoutes },
    { path: "/specialties", route: specialties_route_1.specialtiesRoutes },
    { path: "/doctors", route: doctor_route_1.doctorRoutes },
    { path: "/appointment", route: appointment_route_1.appointmentRoutes },
    { path: "/prescription", route: prescription_route_1.prescriptionRoutes },
    { path: "/review", route: review_route_1.reviewRoutes },
    { path: "/patient", route: patient_route_1.patientRoutes },
    { path: "/metadata", route: meta_route_1.metaRoutes },
    { path: "/admin", route: admin_route_1.AdminRoutes },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map