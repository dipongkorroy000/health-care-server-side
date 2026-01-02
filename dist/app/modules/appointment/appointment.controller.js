"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const appointment_service_1 = require("./appointment.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../helper/pick"));
const http_status_1 = __importDefault(require("http-status"));
const createAppointment = (0, catchAsync_1.default)(async (req, res) => {
    const result = await appointment_service_1.AppointmentService.createAppointment(req.user, req.body);
    (0, sendResponse_1.default)(res, { status: 201, success: true, message: "Appointment created successfully!", data: result });
});
const getMyAppointment = (0, catchAsync_1.default)(async (req, res) => {
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = (0, pick_1.default)(req.query, ["status", "paymentStatus"]);
    const user = req.user;
    const result = await appointment_service_1.AppointmentService.getMyAppointment(user, filters, options);
    (0, sendResponse_1.default)(res, { status: 200, success: true, message: "Appointment fetched successfully!", data: result.data, meta: result.meta });
});
const updateAppointmentStatus = (0, catchAsync_1.default)(async (req, res) => {
    const result = await appointment_service_1.AppointmentService.updateAppointmentStatus(req.params.id, req.body.status, req.user);
    (0, sendResponse_1.default)(res, { status: 200, success: true, message: "Appointment updated successfully!", data: result });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ["status", "paymentStatus", "patientEmail", "doctorEmail"]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await appointment_service_1.AppointmentService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Appointment retrieval successfully",
        meta: result.meta,
        data: result.data,
    });
});
const createAppointmentWithPayLater = (0, catchAsync_1.default)(async (req, res) => {
    const result = await appointment_service_1.AppointmentService.createAppointmentWithPayLater(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Appointment booked successfully! You can pay later.",
        data: result,
    });
});
const initiatePayment = (0, catchAsync_1.default)(async (req, res) => {
    const result = await appointment_service_1.AppointmentService.initiatePaymentForAppointment(req.user, req.params.id);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Payment session created successfully",
        data: result,
    });
});
exports.AppointmentController = {
    createAppointment,
    getMyAppointment,
    updateAppointmentStatus,
    getAllFromDB,
    createAppointmentWithPayLater,
    initiatePayment,
};
//# sourceMappingURL=appointment.controller.js.map