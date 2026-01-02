import { Request, Response } from "express";
export declare const UserController: {
    createPatient: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllUser: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    createDoctor: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    createAdmin: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyProfile: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    changeProfileStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateMyProfile: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=user.controller.d.ts.map