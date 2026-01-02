import { z } from "zod";
export declare const adminValidationSchemas: {
    update: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            contactNumber: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=admin.validation.d.ts.map