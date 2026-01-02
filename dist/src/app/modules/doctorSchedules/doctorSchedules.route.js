"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const doctorSchedules_controller_1 = require("./doctorSchedules.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const doctorSchedules_validation_1 = require("./doctorSchedules.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.DOCTOR), (0, validateRequest_1.default)(doctorSchedules_validation_1.DoctorScheduleValidation.createDoctorScheduleValidationSchema), doctorSchedules_controller_1.DoctorScheduleController.insertIntoDB);
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), doctorSchedules_controller_1.DoctorScheduleController.getAllFromDB);
router.get("/my-schedule", (0, auth_1.default)(client_1.UserRole.DOCTOR), doctorSchedules_controller_1.DoctorScheduleController.getMySchedule);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.DOCTOR), doctorSchedules_controller_1.DoctorScheduleController.deleteFromDB);
exports.doctorScheduleRoutes = router;
//# sourceMappingURL=doctorSchedules.route.js.map