"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const patient_controller_1 = require("./patient.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), patient_controller_1.PatientController.getAllFromDB);
router.get("/:id", patient_controller_1.PatientController.getByIdFromDB);
router.patch("/", (0, auth_1.default)(client_1.UserRole.PATIENT), patient_controller_1.PatientController.updateIntoDB);
router.delete("/soft/:id", (0, auth_1.default)(client_1.UserRole.PATIENT), patient_controller_1.PatientController.softDelete);
exports.patientRoutes = router;
//# sourceMappingURL=patient.route.js.map