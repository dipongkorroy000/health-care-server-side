"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../helper/pick"));
const patient_service_1 = require("./patient.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ["searchTerm", "email", "contactNo"]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await patient_service_1.PatientService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Patient retrieval successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getByIdFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await patient_service_1.PatientService.getByIdFromDB(id);
    (0, sendResponse_1.default)(res, { status: http_status_1.default.OK, success: true, message: "Patient retrieval successfully", data: result });
});
const softDelete = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await patient_service_1.PatientService.softDelete(id);
    (0, sendResponse_1.default)(res, { status: http_status_1.default.OK, success: true, message: "Patient soft deleted successfully", data: result });
});
const updateIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await patient_service_1.PatientService.updateIntoDB(user, req.body);
    (0, sendResponse_1.default)(res, { status: http_status_1.default.OK, success: true, message: "Patient updated successfully", data: result });
});
exports.PatientController = { getAllFromDB, getByIdFromDB, softDelete, updateIntoDB };
//# sourceMappingURL=patient.controller.js.map