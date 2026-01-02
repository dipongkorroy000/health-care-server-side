import { z } from "zod";
export declare const AppointmentValidation: {
    createAppointment: z.ZodObject<{
        body: z.ZodObject<{
            doctorId: z.ZodString;
            scheduleId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=appointment.validation.d.ts.map