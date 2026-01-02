"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const specialties_service_1 = require("./specialties.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const insertIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const file = req.file;
    const result = await specialties_service_1.SpecialtiesService.insertIntoDB(payload, file);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Specialties created successfully!",
        data: result,
    });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await specialties_service_1.SpecialtiesService.getAllFromDB();
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Specialties data fetched successfully",
        data: result,
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await specialties_service_1.SpecialtiesService.deleteFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Specialty deleted successfully",
        data: result,
    });
});
exports.SpecialtiesController = { insertIntoDB, getAllFromDB, deleteFromDB };
//# sourceMappingURL=specialties.controller.js.map