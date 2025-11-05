import { UserRole } from "@prisma/client";
import express, { Router } from "express";
import auth from "../../middlewares/auth";
import { PrescriptionController } from "./prescription.controller";

const router: Router = express.Router();

router.post("/", auth(UserRole.DOCTOR), PrescriptionController.createPrescription);

export const prescriptionRoutes = router;
