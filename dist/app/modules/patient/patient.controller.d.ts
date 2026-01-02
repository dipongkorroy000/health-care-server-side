import { Request, Response } from "express";
export declare const PatientController: {
    getAllFromDB: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getByIdFromDB: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    softDelete: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateIntoDB: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=patient.controller.d.ts.map