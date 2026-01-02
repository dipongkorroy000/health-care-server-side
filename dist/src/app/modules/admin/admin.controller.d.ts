import { NextFunction, Request, Response } from "express";
export declare const AdminController: {
    getAllFromDB: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getByIdFromDB: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateIntoDB: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteFromDB: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    softDeleteFromDB: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=admin.controller.d.ts.map