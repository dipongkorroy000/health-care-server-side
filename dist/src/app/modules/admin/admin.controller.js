"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../helper/pick"));
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ["name", "email", "searchTerm", "contactNumber"]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await admin_service_1.AdminService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Admin data fetched!",
        meta: result.meta,
        data: result.data,
    });
});
const getByIdFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminService.getByIdFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Admin data fetched by id!",
        data: result,
    });
});
const updateIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminService.updateIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Admin data updated!",
        data: result,
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminService.deleteFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Admin data deleted!",
        data: result,
    });
});
const softDeleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminService.softDeleteFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Admin data deleted!",
        data: result,
    });
});
exports.AdminController = { getAllFromDB, getByIdFromDB, updateIntoDB, deleteFromDB, softDeleteFromDB };
//# sourceMappingURL=admin.controller.js.map