import express, { type Application, type Express } from "express";
import cors from "cors";
import cron from "node-cron";
import config from "./config";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { PaymentController } from "./app/modules/payments/payment.controller";
import { AppointmentService } from "./app/modules/appointment/appointment.service";

const app: Application = express();

// this webhook call -> when appointment create by patient then call this webhook for payment
app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);

// parser
app.use(cors({ origin: config.client_url, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// cron.schedule("* * * * *", () => {
//   try {
//     console.log("Node cron called at ", new Date());
//     AppointmentService.cancelUnpaidAppointments();
//   } catch (error) {
//     console.log(error);
//   }
// });


app.use("/api/v1", router);

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

app.use(notFound);

app.use(globalErrorHandler);

export default app;
