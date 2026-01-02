import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../helper/jsonwebtoken";
import config from "../../config";
import ApiError from "../errors/apiError";
import status from "http-status";

const auth = (...roles: string[]) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) throw new ApiError(status.UNAUTHORIZED, "You are not authorized!");

      const verifyTkn = jwtHelper.verifyToken(token, config.jwt.jwt_secret);

      req.user = verifyTkn;

      if (roles.length && !roles.includes(verifyTkn.role)) throw new ApiError(status.UNAUTHORIZED, "You are not authorized user!");

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
