"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("../helper/jsonwebtoken");
const config_1 = __importDefault(require("../../config"));
const apiError_1 = __importDefault(require("../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.accessToken;
            if (!token)
                throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
            const verifyTkn = jsonwebtoken_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwt_secret);
            req.user = verifyTkn;
            if (roles.length && !roles.includes(verifyTkn.role))
                throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized user!");
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = auth;
//# sourceMappingURL=auth.js.map