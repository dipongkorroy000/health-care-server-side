import express, { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router: Router = express.Router();

router.post("/login", AuthController.login);

router.get("/me", AuthController.getMe);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/change-password", auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), AuthController.changePassword);

router.post("/reset-password", AuthController.resetPassword);

router.post("/forgot-password", AuthController.forgotPassword);

export const authRoutes = router;
