"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../helper/pick"));
const http_status_1 = __importDefault(require("http-status"));
const createPatient = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.createPatient(req.body, req.file);
    (0, sendResponse_1.default)(res, { status: 201, success: true, message: "Patient created successfully", data: result });
});
const getAllUser = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ["status", "role", "email", "searchTerm"]);
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await user_service_1.UserService.getAllUser(filters, options);
    (0, sendResponse_1.default)(res, { status: 200, success: true, message: "Users retrieved successfully", data: result });
});
const createDoctor = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.createDoctor(req.body, req.file);
    (0, sendResponse_1.default)(res, { status: 201, success: true, message: "Doctor Created successfully!", data: result });
});
const createAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.createAdmin(req.body, req.file);
    (0, sendResponse_1.default)(res, { status: 201, success: true, message: "Admin Created successfuly!", data: result });
});
const getMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await user_service_1.UserService.getMyProfile(user);
    (0, sendResponse_1.default)(res, { status: http_status_1.default.OK, success: true, message: "My profile data fetched!", data: result });
});
const changeProfileStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserService.changeProfileStatus(id, req.body);
    (0, sendResponse_1.default)(res, { status: http_status_1.default.OK, success: true, message: "Users profile status changed!", data: result });
});
const updateMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.updateMyProfile(req.user, req.body, req.file);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "My profile updated!",
        data: result,
    });
});
exports.UserController = { createPatient, getAllUser, createDoctor, createAdmin, getMyProfile, changeProfileStatus, updateMyProfile };
//# sourceMappingURL=user.controller.js.map