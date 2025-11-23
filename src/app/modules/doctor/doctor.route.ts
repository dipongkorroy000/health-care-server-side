import express, { Router } from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router: Router = express.Router();

router.get("/", DoctorController.getAllFromDB);

router.get("/:id", DoctorController.getByIdFromDB);

router.patch("/:id", auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN), DoctorController.updateIntoDB);

router.delete("/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), DoctorController.deleteFromDB);

router.delete("/soft/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), DoctorController.softDelete);
router.post("/suggestion", DoctorController.getAISuggestions);

export const doctorRoutes = router;
