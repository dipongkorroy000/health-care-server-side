"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const doctorSchedules_service_1 = require("./doctorSchedules.service");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../helper/pick"));
const insertIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await doctorSchedules_service_1.DoctorScheduleService.insertIntoDB(user, req.body);
    (0, sendResponse_1.default)(res, {
        status: 201,
        success: true,
        message: "Doctor Schedule created successfully!",
        data: result,
    });
});
const getMySchedule = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ["startDate", "endDate", "isBooked"]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = await doctorSchedules_service_1.DoctorScheduleService.getMySchedule(filters, options, user);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "My Schedule fetched successfully!",
        data: result.data,
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const result = await doctorSchedules_service_1.DoctorScheduleService.deleteFromDB(user, id);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "My Schedule deleted successfully!",
        data: result,
    });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ["searchTerm", "isBooked", "doctorId"]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await doctorSchedules_service_1.DoctorScheduleService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Doctor Schedule retrieval successfully",
        meta: result.meta,
        data: result.data,
    });
});
exports.DoctorScheduleController = { insertIntoDB, getMySchedule, deleteFromDB, getAllFromDB };
//# sourceMappingURL=doctorSchedules.controller.js.map