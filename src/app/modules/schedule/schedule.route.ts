import express, {type Router} from "express";
import {ScheduleController} from "./schedule.controller";
import auth from "../../middlewares/auth";
import {UserRole} from "@prisma/client";

const router: Router = express.Router();

router.post("/", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), ScheduleController.insertIntoDB);

router.get("/", auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN), ScheduleController.schedulesForDoctor);

router.delete("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), ScheduleController.deleteScheduleFromDB);
export const scheduleRoutes = router;
