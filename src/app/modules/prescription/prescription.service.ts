import {AppointmentStatus, PaymentStatus, Prescription, UserRole} from "@prisma/client";

import httpStatus from "http-status";
import ApiError from "../../errors/apiError";
import {IJWTPayload} from "../../types/reqUser";
import {IPaginationOptions, paginationHelper} from "../../helper/paginationHelper";
import prisma from "../../shared/prisma";

const createPrescription = async (user: IJWTPayload, payload: Partial<Prescription>) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {id: payload.appointmentId as string, status: AppointmentStatus.COMPLETED, paymentStatus: PaymentStatus.PAID},
    include: {doctor: true},
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
    include: {patient: true},
  });
};

const patientPrescription = async (user: IJWTPayload, options: IPaginationOptions) => {
  const {limit, page, sortBy, sortOrder} = paginationHelper.calculatePagination(options);

  const result = await prisma.prescription.findMany({
    where: {patient: {email: user.email}},
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {[sortBy]: sortOrder},
    include: {doctor: true, patient: true, appointment: true},
  });

  const total = await prisma.prescription.count({where: {patient: {email: user.email}}});

  return {meta: {total, page, limit}, data: result};
};

// get my prescription as a patient

export const PrescriptionService = {createPrescription, patientPrescription};
