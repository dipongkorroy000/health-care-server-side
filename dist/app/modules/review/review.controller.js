"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const review_service_1 = require("./review.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../helper/pick"));
const insertIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await review_service_1.ReviewService.insertIntoDB(user, req.body);
    (0, sendResponse_1.default)(res, { status: http_status_1.default.OK, success: true, message: "Review created successfully", data: result });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ["patientEmail", "doctorEmail"]);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await review_service_1.ReviewService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Reviews retrieval successfully",
        meta: result.meta,
        data: result.data,
    });
});
exports.ReviewController = { insertIntoDB, getAllFromDB };
//# sourceMappingURL=review.controller.js.map