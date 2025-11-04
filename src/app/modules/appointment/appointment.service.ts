import { stripe } from "../../helper/stripe";
import { prisma } from "../../shared/prisma";
// import { v4 as uuidv4 } from "uuid";
import { IJWTPayload } from "../../types/reqUser";

const createAppointment = async (user: IJWTPayload, payload: { doctorId: string; scheduleId: string }) => {
  const patientData = await prisma.patient.findUniqueOrThrow({ where: { email: user.email } });

  const doctorData = await prisma.doctor.findUniqueOrThrow({ where: { id: payload.doctorId, isDeleted: false } });

  await prisma.doctorSchedules.findFirstOrThrow({ where: { doctorId: payload.doctorId, scheduleId: payload.scheduleId, isBooked: false } });

  // const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: { patientId: patientData.id, doctorId: doctorData.id, scheduleId: payload.scheduleId, videoCallingId: "demo" },
    });

    await tnx.doctorSchedules.update({
      where: { doctorId_scheduleId: { doctorId: doctorData.id, scheduleId: payload.scheduleId } },
      data: { isBooked: true },
    });

    // const transactionId = uuidv4();

    await tnx.payment.create({ data: { appointmentId: appointmentData.id, amount: doctorData.appointmentFee, transactionId: "demo12" } });

    // payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: { name: `Appointment with ${doctorData.name}` },
            unit_amount: doctorData.appointmentFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { appointmentId: appointmentData.id, paymentId: patientData.id },

      success_url: "https://github.com/dipongkorroy000",
      cancel_url: "https://www.facebook.com/profile.php?id=61570830432784",
    });

    console.log("session", { session });

    return { paymentUrl: session.url };
  });

  return result;
};

export const AppointmentService = { createAppointment };
