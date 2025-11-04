import express, { type Application, type Express } from "express";
import cors from "cors";
// import dotenv from "dotenv";
import config from "./config";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { PaymentController } from "./app/modules/payments/payment.controller";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// dotenv.config();

// this webhook call -> when appointment create by patient then call this webhook for payment
app.post("/api/v1/payment/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send({
    message: "Server is running",
    environment: config.node_env,
    uptime: process.uptime().toFixed(2) + "sec",
    timeStamp: new Date().toISOString(),
  });
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

app.use(notFound);

app.use(globalErrorHandler);

export default app;
