import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // console.log(err);
  let status: number = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      (message = "Duplicate key error"), (error = err.meta);
      status = httpStatus.CONFLICT;
    }
    if (err.code === "P1000") {
      message = "Authentication failed against database server";
      error = err.meta;
      status = httpStatus.BAD_GATEWAY;
    }
    if (err.code === "P2003") {
      message = "Foreign key constraint failed";
      error = err.meta;
      status = httpStatus.BAD_REQUEST;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    (message = "Validation error"), (error = err.message);
    status = httpStatus.BAD_REQUEST;
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    (message = "Unknown prisma error occurred"), (error = err.message);
    status = httpStatus.BAD_REQUEST;
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    (message = "Prisma client failed to initialize!"), (error = err.message);
    status = httpStatus.BAD_REQUEST;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    message = "An operation failed because it depends on one or more records that were required but not found";
    error = err.message;
    status = httpStatus.NOT_FOUND;
  }

  res.status(status).json({ success, message, error });
};

export default globalErrorHandler;
