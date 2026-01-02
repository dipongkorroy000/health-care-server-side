"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const handleStripeWebhookEvent = async (event) => {
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const appointmentId = session.metadata?.appointmentId;
            const paymentId = session.metadata?.paymentId;
            console.log("session payment", { session, appointmentId, paymentId });
            await prisma_1.default.appointment.update({
                where: { id: appointmentId },
                data: { paymentStatus: session.payment_status === "paid" ? client_1.PaymentStatus.PAID : client_1.PaymentStatus.UNPAID },
            });
            await prisma_1.default.payment.update({
                where: { id: paymentId },
                data: {
                    status: session.payment_status === "paid" ? client_1.PaymentStatus.PAID : client_1.PaymentStatus.UNPAID,
                    paymentGatewayData: session,
                },
            });
            break;
        }
        default:
            console.log(`I Unhandled event type: ${event.type}`);
    }
};
exports.PaymentService = { handleStripeWebhookEvent };
//# sourceMappingURL=payment.service.js.map