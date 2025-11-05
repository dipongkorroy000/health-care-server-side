import express, { Router } from "express";
import { PatientController } from "./patient.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router: Router = express.Router();

router.get("/", auth(UserRole.ADMIN), PatientController.getAllFromDB);

router.get("/:id", PatientController.getByIdFromDB);

router.patch("/", auth(UserRole.PATIENT), PatientController.updateIntoDB);

router.delete("/soft/:id", auth(UserRole.PATIENT), PatientController.softDelete);

export const patientRoutes = router;
