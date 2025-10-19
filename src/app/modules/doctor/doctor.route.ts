import express, { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router: Router = express.Router();

router.get("/", DoctorController.getAllFromDB);

router.patch("/:id", DoctorController.updateIntoDB);

export const doctorRoutes = router;
