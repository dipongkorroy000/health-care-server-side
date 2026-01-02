"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../helper/pick"));
const doctor_service_1 = require("./doctor.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = (0, pick_1.default)(req.query, ["email", "contactNumber", "gender", "appointmentFee", "specialties", "searchTerm"]);
    const result = await doctor_service_1.DoctorService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Doctor fetched successfully!",
        meta: result.meta,
        data: result.data,
    });
});
const updateIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await doctor_service_1.DoctorService.updateIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, { status: 200, success: true, message: "Doctor updated successfully!", data: result });
});
const getByIdFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await doctor_service_1.DoctorService.getByIdFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Doctor retrieval successfully",
        data: result,
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await doctor_service_1.DoctorService.deleteFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Doctor deleted successfully",
        data: result,
    });
});
const softDelete = (0, catchAsync_1.default)(async (req, res) => {
    const result = await doctor_service_1.DoctorService.softDelete(req.params.id);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Doctor soft deleted successfully",
        data: result,
    });
});
const getAISuggestions = (0, catchAsync_1.default)(async (req, res) => {
    const result = await doctor_service_1.DoctorService.getAISuggestions(req.body);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "AI suggestions fetched successfully",
        data: result,
    });
});
exports.DoctorController = { getAllFromDB, updateIntoDB, getByIdFromDB, deleteFromDB, softDelete, getAISuggestions };
//# sourceMappingURL=doctor.controller.js.map