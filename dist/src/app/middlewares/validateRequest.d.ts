import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
declare const validateRequest: (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default validateRequest;
//# sourceMappingURL=validateRequest.d.ts.map