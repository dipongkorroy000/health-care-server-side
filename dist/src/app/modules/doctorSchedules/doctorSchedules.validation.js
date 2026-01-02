"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const createDoctorScheduleValidationSchema = zod_1.default.object({
    body: zod_1.default.object({ scheduleIds: zod_1.default.array(zod_1.default.string()) }),
});
exports.DoctorScheduleValidation = { createDoctorScheduleValidationSchema };
//# sourceMappingURL=doctorSchedules.validation.js.map