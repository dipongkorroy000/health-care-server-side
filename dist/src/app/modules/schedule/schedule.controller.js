"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const schedule_service_1 = require("./schedule.service");
const pick_1 = __importDefault(require("../../helper/pick"));
const insertIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const result = await schedule_service_1.ScheduleService.insertIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        status: 201,
        success: true,
        message: "Schedule created successfully!",
        data: result,
    });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = (0, pick_1.default)(req.query, ["startDate", "endDate"]);
    const result = await schedule_service_1.ScheduleService.getAllFromDB(user, filters, options);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Schedule retrieved successfully!",
        data: result,
    });
});
const deleteScheduleFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await schedule_service_1.ScheduleService.deleteScheduleFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Schedule deleted successfully!",
        data: result,
    });
});
const getByIdFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await schedule_service_1.ScheduleService.getByIdFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Schedule retrieved successfully",
        data: result,
    });
});
exports.ScheduleController = {
    insertIntoDB,
    getAllFromDB,
    deleteScheduleFromDB,
    getByIdFromDB,
};
//# sourceMappingURL=schedule.controller.js.map