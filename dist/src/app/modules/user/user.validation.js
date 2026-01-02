"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const createPatientValidationSchema = zod_1.default.object({
    password: zod_1.default.string(),
    patient: zod_1.default.object({
        name: zod_1.default.string().nonempty("Name is required"),
        email: zod_1.default.string().nonempty("Email is required"),
        address: zod_1.default.string().optional(),
    }),
});
const createDoctorValidationSchema = zod_1.default.object({
    password: zod_1.default.string({ error: "Password is required" }),
    doctor: zod_1.default.object({
        name: zod_1.default.string({ error: "Name is required!" }),
        email: zod_1.default.string({ error: "Email is required!" }),
        contactNumber: zod_1.default.string({ error: "Contact Number is required!" }),
        address: zod_1.default.string().optional(),
        registrationNumber: zod_1.default.string({ error: "Reg number is required" }),
        experience: zod_1.default.number().optional(),
        gender: zod_1.default.enum([client_1.Gender.MALE, client_1.Gender.FEMALE]),
        appointmentFee: zod_1.default.number({ error: "appointment fee is required" }),
        qualification: zod_1.default.string({ error: "quilification is required" }),
        currentWorkingPlace: zod_1.default.string({ error: "Current working place is required!" }),
        designation: zod_1.default.string({ error: "Designation is required!" }),
        // NEW: Add specialties array for doctor creation
        specialties: zod_1.default
            .array(zod_1.default.string().uuid({ message: "Each specialty must be a valid UUID" }))
            .min(1, { message: "At least one specialty is required" })
            .optional(),
    }),
});
const createAdminValidationSchema = zod_1.default.object({
    password: zod_1.default.string({ error: "Password is required" }),
    admin: zod_1.default.object({
        name: zod_1.default.string({ error: "Name is required!" }),
        email: zod_1.default.string({ error: "Email is required!" }),
        contactNumber: zod_1.default.string({ error: "Contact Number is required!" }),
    }),
});
exports.UserValidation = { createPatientValidationSchema, createDoctorValidationSchema, createAdminValidationSchema };
//# sourceMappingURL=user.validation.js.map