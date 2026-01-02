import { Request, Response } from "express";
export declare const DoctorController: {
    getAllFromDB: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateIntoDB: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getByIdFromDB: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteFromDB: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    softDelete: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAISuggestions: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=doctor.controller.d.ts.map