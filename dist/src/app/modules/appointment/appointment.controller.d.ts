import { Request, Response } from "express";
export declare const AppointmentController: {
    createAppointment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyAppointment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateAppointmentStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllFromDB: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    createAppointmentWithPayLater: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    initiatePayment: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=appointment.controller.d.ts.map