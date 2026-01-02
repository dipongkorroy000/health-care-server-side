"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const login = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.login(req.body);
    const { accessToken, refreshToken, needPasswordChange } = result;
    const accessTokenExpiresIn = config_1.default.jwt.expires_in;
    const refreshTokenExpiresIn = config_1.default.jwt.refresh_token_expires_in;
    // convert accessTokenExpiresIn to milliseconds
    let accessTokenMaxAge = 0;
    const accessTokenUnit = accessTokenExpiresIn.slice(-1);
    const accessTokenValue = parseInt(accessTokenExpiresIn.slice(0, -1));
    if (accessTokenUnit === "y")
        accessTokenMaxAge = accessTokenValue * 365 * 24 * 60 * 60 * 1000;
    else if (accessTokenUnit === "M")
        accessTokenMaxAge = accessTokenValue * 30 * 24 * 60 * 60 * 1000;
    else if (accessTokenUnit === "w")
        accessTokenMaxAge = accessTokenValue * 7 * 24 * 60 * 60 * 1000;
    else if (accessTokenUnit === "d")
        accessTokenMaxAge = accessTokenValue * 24 * 60 * 60 * 1000;
    else if (accessTokenUnit === "h")
        accessTokenMaxAge = accessTokenValue * 60 * 60 * 1000;
    else if (accessTokenUnit === "m")
        accessTokenMaxAge = accessTokenValue * 60 * 1000;
    else if (accessTokenUnit === "s")
        accessTokenMaxAge = accessTokenValue * 1000;
    else
        accessTokenMaxAge = 1000 * 60 * 60; // default 1 hour
    // convert refreshTokenExpiresIn to milliseconds
    let refreshTokenMaxAge = 0;
    const refreshTokenUnit = refreshTokenExpiresIn.slice(-1);
    const refreshTokenValue = parseInt(refreshTokenExpiresIn.slice(0, -1));
    if (refreshTokenUnit === "y")
        refreshTokenMaxAge = refreshTokenValue * 365 * 24 * 60 * 60 * 1000;
    else if (refreshTokenUnit === "M")
        refreshTokenMaxAge = refreshTokenValue * 30 * 24 * 60 * 60 * 1000;
    else if (refreshTokenUnit === "w")
        refreshTokenMaxAge = refreshTokenValue * 7 * 24 * 60 * 60 * 1000;
    else if (refreshTokenUnit === "d")
        refreshTokenMaxAge = refreshTokenValue * 24 * 60 * 60 * 1000;
    else if (refreshTokenUnit === "h")
        refreshTokenMaxAge = refreshTokenValue * 60 * 60 * 1000;
    else if (refreshTokenUnit === "m")
        refreshTokenMaxAge = refreshTokenValue * 60 * 1000;
    else if (refreshTokenUnit === "s")
        refreshTokenMaxAge = refreshTokenValue * 1000;
    else
        refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 30; // default 30 days
    res.cookie("accessToken", accessToken, { secure: true, httpOnly: true, sameSite: "none", maxAge: accessTokenMaxAge });
    res.cookie("refreshToken", refreshToken, { secure: true, httpOnly: true, sameSite: "none", maxAge: refreshTokenMaxAge });
    (0, sendResponse_1.default)(res, { status: 200, success: true, message: "Login Successfully", data: { needPasswordChange } });
});
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies || req.headers;
    console.log({ refreshToken }); // for debugging
    /*
    EXPIRES_IN=7d
  
  REFRESH_TOKEN_EXPIRES_IN=1y
    */
    const accessTokenExpiresIn = config_1.default.jwt.expires_in;
    const refreshTokenExpiresIn = config_1.default.jwt.refresh_token_expires_in;
    // convert accessTokenExpiresIn to milliseconds
    let accessTokenMaxAge = 0;
    const accessTokenUnit = accessTokenExpiresIn.slice(-1);
    const accessTokenValue = parseInt(accessTokenExpiresIn.slice(0, -1));
    if (accessTokenUnit === "y")
        accessTokenMaxAge = accessTokenValue * 365 * 24 * 60 * 60 * 1000;
    else if (accessTokenUnit === "M")
        accessTokenMaxAge = accessTokenValue * 30 * 24 * 60 * 60 * 1000;
    else if (accessTokenUnit === "w")
        accessTokenMaxAge = accessTokenValue * 7 * 24 * 60 * 60 * 1000;
    else if (accessTokenUnit === "d")
        accessTokenMaxAge = accessTokenValue * 24 * 60 * 60 * 1000;
    else if (accessTokenUnit === "h")
        accessTokenMaxAge = accessTokenValue * 60 * 60 * 1000;
    else if (accessTokenUnit === "m")
        accessTokenMaxAge = accessTokenValue * 60 * 1000;
    else if (accessTokenUnit === "s")
        accessTokenMaxAge = accessTokenValue * 1000;
    else
        accessTokenMaxAge = 1000 * 60 * 60; // default 1 hour
    // convert refreshTokenExpiresIn to milliseconds
    let refreshTokenMaxAge = 0;
    const refreshTokenUnit = refreshTokenExpiresIn.slice(-1);
    const refreshTokenValue = parseInt(refreshTokenExpiresIn.slice(0, -1));
    if (refreshTokenUnit === "y")
        refreshTokenMaxAge = refreshTokenValue * 365 * 24 * 60 * 60 * 1000;
    else if (refreshTokenUnit === "M")
        refreshTokenMaxAge = refreshTokenValue * 30 * 24 * 60 * 60 * 1000;
    else if (refreshTokenUnit === "w")
        refreshTokenMaxAge = refreshTokenValue * 7 * 24 * 60 * 60 * 1000;
    else if (refreshTokenUnit === "d")
        refreshTokenMaxAge = refreshTokenValue * 24 * 60 * 60 * 1000;
    else if (refreshTokenUnit === "h")
        refreshTokenMaxAge = refreshTokenValue * 60 * 60 * 1000;
    else if (refreshTokenUnit === "m")
        refreshTokenMaxAge = refreshTokenValue * 60 * 1000;
    else if (refreshTokenUnit === "s")
        refreshTokenMaxAge = refreshTokenValue * 1000;
    else
        refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 30; // default 30 days
    const result = await auth_service_1.AuthService.refreshToken(refreshToken);
    res.cookie("accessToken", result.accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: accessTokenMaxAge,
    });
    res.cookie("refreshToken", result.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: refreshTokenMaxAge,
    });
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Access token generated successfully!",
        data: { message: "Access token generated successfully!" },
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await auth_service_1.AuthService.changePassword(user, req.body);
    (0, sendResponse_1.default)(res, { status: http_status_1.default.OK, success: true, message: "Password Changed successfully", data: result });
});
const forgotPassword = (0, catchAsync_1.default)(async (req, res) => {
    await auth_service_1.AuthService.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, { status: http_status_1.default.OK, success: true, message: "Check your email!", data: null });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    // Extract token from Authorization header (remove "Bearer " prefix)
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace("Bearer ", "") : null;
    console.log({ authHeader });
    await auth_service_1.AuthService.resetPassword(token, req.body, req.user);
    (0, sendResponse_1.default)(res, { status: http_status_1.default.OK, success: true, message: "Password Reset!", data: null });
});
const getMe = (0, catchAsync_1.default)(async (req, res) => {
    const userSession = req.cookies;
    const result = await auth_service_1.AuthService.getMe(userSession);
    (0, sendResponse_1.default)(res, { status: http_status_1.default.OK, success: true, message: "User retrieve successfully!", data: result });
});
exports.AuthController = { login, refreshToken, changePassword, resetPassword, getMe, forgotPassword };
//# sourceMappingURL=auth.controller.js.map