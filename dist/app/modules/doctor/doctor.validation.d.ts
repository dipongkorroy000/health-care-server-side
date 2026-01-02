import { z } from "zod";
export declare const DoctorValidation: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            name: z.ZodString;
            profilePhoto: z.ZodString;
            contactNumber: z.ZodString;
            registrationNumber: z.ZodString;
            experience: z.ZodNumber;
            gender: z.ZodString;
            appointmentFee: z.ZodNumber;
            qualification: z.ZodString;
            currentWorkingPlace: z.ZodString;
            designation: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            profilePhoto: z.ZodOptional<z.ZodString>;
            contactNumber: z.ZodOptional<z.ZodString>;
            registrationNumber: z.ZodOptional<z.ZodString>;
            experience: z.ZodOptional<z.ZodNumber>;
            gender: z.ZodOptional<z.ZodString>;
            appointmentFee: z.ZodOptional<z.ZodNumber>;
            qualification: z.ZodOptional<z.ZodString>;
            currentWorkingPlace: z.ZodOptional<z.ZodString>;
            designation: z.ZodOptional<z.ZodString>;
            specialties: z.ZodOptional<z.ZodArray<z.ZodUUID>>;
            removeSpecialties: z.ZodOptional<z.ZodArray<z.ZodUUID>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=doctor.validation.d.ts.map