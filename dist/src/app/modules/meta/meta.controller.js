"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaController = void 0;
const meta_service_1 = require("./meta.service");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const fetchDashboardMetaData = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await meta_service_1.MetaService.fetchDashboardMetaData(user);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Meta data retrival successfully!",
        data: result,
    });
});
exports.MetaController = { fetchDashboardMetaData };
//# sourceMappingURL=meta.controller.js.map