"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./app/routes"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const payment_controller_1 = require("./app/modules/payments/payment.controller");
const app = (0, express_1.default)();
// parser
app.use((0, cors_1.default)({ origin: config_1.default.client_url, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// cron.schedule("* * * * *", () => {
//   try {
//     console.log("Node cron called at ", new Date());
//     AppointmentService.cancelUnpaidAppointments();
//   } catch (error) {
//     console.log(error);
//   }
// });
// this webhook call -> when appointment create by patient then call this webhook for payment
app.post("/api/v1/payment/webhook", express_1.default.raw({ type: "application/json" }), payment_controller_1.PaymentController.handleStripeWebhookEvent);
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send({
        message: "Server is running",
        // environment: config.node_env,
        // uptime: process.uptime().toFixed(2) + "sec",
        // timeStamp: new Date().toISOString(),
    });
});
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route Not Found" });
});
app.use(notFound_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map