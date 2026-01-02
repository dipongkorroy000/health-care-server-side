"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (err, req, res, next) => {
    // console.log(err);
    let status = err.status || http_status_1.default.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            (message = "Duplicate key error"), (error = err.meta);
            status = http_status_1.default.CONFLICT;
        }
        if (err.code === "P1000") {
            message = "Authentication failed against database server";
            error = err.meta;
            status = http_status_1.default.BAD_GATEWAY;
        }
        if (err.code === "P2003") {
            message = "Foreign key constraint failed";
            error = err.meta;
            status = http_status_1.default.BAD_REQUEST;
        }
    }
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        (message = "Validation error"), (error = err.message);
        status = http_status_1.default.BAD_REQUEST;
    }
    if (err instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        (message = "Unknown prisma error occurred"), (error = err.message);
        status = http_status_1.default.BAD_REQUEST;
    }
    if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        (message = "Prisma client failed to initialize!"), (error = err.message);
        status = http_status_1.default.BAD_REQUEST;
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        message = "An operation failed because it depends on one or more records that were required but not found";
        error = err.message;
        status = http_status_1.default.NOT_FOUND;
    }
    res.status(status).json({ success, message, error });
};
exports.default = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map