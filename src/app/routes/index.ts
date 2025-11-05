import express, { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";
import { doctorScheduleRoutes } from "../modules/doctorSchedules/doctorSchedules.route";
import { specialtiesRoutes } from "../modules/specialties/specialties.route";
import { doctorRoutes } from "../modules/doctor/doctor.route";
import { appointmentRoutes } from "../modules/appointment/appointment.route";
import { prescriptionRoutes } from "../modules/prescription/prescription.route";
import { reviewRoutes } from "../modules/review/review.route";
import { patientRoutes } from "../modules/patient/patient.route";

const router: Router = express.Router();

const moduleRoutes = [
  { path: "/user", route: userRoutes },
  { path: "/auth", route: authRoutes },
  { path: "/schedule", route: scheduleRoutes },
  { path: "/doctor-schedule", route: doctorScheduleRoutes },
  { path: "/specialties", route: specialtiesRoutes },
  { path: "/doctors", route: doctorRoutes },
  { path: "/appointment", route: appointmentRoutes },
  { path: "/prescription", route: prescriptionRoutes },
  { path: "/review", route: reviewRoutes },
  { path: "/patient", route: patientRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
