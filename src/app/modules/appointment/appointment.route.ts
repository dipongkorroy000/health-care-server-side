import express, { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router: Router = express.Router();

router.post("/", auth(UserRole.PATIENT), AppointmentController.createAppointment);

export const appointmentRoutes = router;
