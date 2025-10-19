import express, { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedules.controller";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedules.validation";

const router: Router = express.Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(DoctorScheduleValidation.createDoctorScheduleValidationSchema),
  DoctorScheduleController.insertIntoDB
);

export const doctorScheduleRoutes = router;
