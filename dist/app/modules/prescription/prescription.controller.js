"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const prescription_service_1 = require("./prescription.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../helper/pick"));
const http_status_1 = __importDefault(require("http-status"));
const createPrescription = (0, catchAsync_1.default)(async (req, res) => {
    const result = await prescription_service_1.PrescriptionService.createPrescription(req.user, req.body);
    (0, sendResponse_1.default)(res, { status: 201, success: true, message: "prescription created successfully!", data: result });
});
const patientPrescription = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await prescription_service_1.PrescriptionService.patientPrescription(user, options);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Prescription fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});
exports.PrescriptionController = { createPrescription, patientPrescription };
//# sourceMappingURL=prescription.controller.js.map