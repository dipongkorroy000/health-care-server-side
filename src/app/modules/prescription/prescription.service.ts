import { AppointmentStatus, PaymentStatus, Prescription, UserRole } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status";
import ApiError from "../../errors/apiError";
import { IJWTPayload } from "../../types/reqUser";

const createPrescription = async (user: IJWTPayload, payload: Partial<Prescription>) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: { id: payload.appointmentId as string, status: AppointmentStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
    include: { doctor: true },
  });

  if (user.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email)) throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment");
  }

  return await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null,
    },
    include: { patient: true },
  });
};

// get my prescription as a patient

export const PrescriptionService = { createPrescription };
