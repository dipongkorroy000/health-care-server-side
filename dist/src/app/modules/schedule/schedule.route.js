"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const schedule_controller_1 = require("./schedule.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), schedule_controller_1.ScheduleController.insertIntoDB);
router.get("/", (0, auth_1.default)(client_1.UserRole.DOCTOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), schedule_controller_1.ScheduleController.getAllFromDB);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), schedule_controller_1.ScheduleController.deleteScheduleFromDB);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), schedule_controller_1.ScheduleController.getByIdFromDB);
exports.scheduleRoutes = router;
//# sourceMappingURL=schedule.route.js.map