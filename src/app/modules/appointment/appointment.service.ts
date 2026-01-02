import {AppointmentStatus, PaymentStatus, Prisma, UserRole} from "@prisma/client";
import {stripe} from "../../helper/stripe";
import prisma from "../../shared/prisma";
import {v4 as uuidv4} from "uuid";
import {IJWTPayload} from "../../types/reqUser";
import {IPaginationOptions, paginationHelper} from "../../helper/paginationHelper";
import ApiError from "../../errors/apiError";
import httpStatus from "http-status";
import config from "../../../config";

const createAppointment = async (user: IJWTPayload, payload: {doctorId: string; scheduleId: string}) => {
  const patientData = await prisma.patient.findUniqueOrThrow({where: {email: user.email}});

  const doctorData = await prisma.doctor.findUniqueOrThrow({where: {id: payload.doctorId, isDeleted: false}});

  await prisma.doctorSchedules.findFirstOrThrow({where: {doctorId: payload.doctorId, scheduleId: payload.scheduleId, isBooked: false}});

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: {patientId: patientData.id, doctorId: doctorData.id, scheduleId: payload.scheduleId, videoCallingId: videoCallingId},
    });

    await tnx.doctorSchedules.update({
      where: {doctorId_scheduleId: {doctorId: doctorData.id, scheduleId: payload.scheduleId}},
      data: {isBooked: true},
    });

    const transactionId = uuidv4();

    await tnx.payment.create({data: {appointmentId: appointmentData.id, amount: doctorData.appointmentFee, transactionId: transactionId}});

    // payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {name: `Appointment with ${doctorData.name}`},
            unit_amount: doctorData.appointmentFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {appointmentId: appointmentData.id, paymentId: patientData.id},

      success_url: config.payment_success_url,
      cancel_url: config.payment_cancel_url,
    });

    // console.log("session", { session });

    return {paymentUrl: session.url};
  });

  return result;
};

const getMyAppointment = async (user: IJWTPayload, filters: any, options: IPaginationOptions) => {
  const {page, limit, sortBy, sortOrder} = paginationHelper.calculatePagination(options);
  const {...filterData} = filters;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user.role === UserRole.PATIENT) andConditions.push({patient: {email: user.email}});
  else if (user.role === UserRole.DOCTOR) andConditions.push({doctor: {email: user.email}});

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({[key]: {equals: (filterData as any)[key]}}));

    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.AppointmentWhereInput = andConditions.length > 0 ? {AND: andConditions} : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {[sortBy]: sortOrder},
    include:
      user.role === UserRole.DOCTOR
        ? {patient: {include: {medicalReports: true, patientHealthData: true}}, schedule: true, prescription: true, review: true}
        : {doctor: true, schedule: true, review: true, prescription: true},
  });

  const total = await prisma.appointment.count({where: whereConditions});

  return {meta: {total, limit, page}, data: result};
};

// task get all data from db (appointment data)- admin

const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus, user: IJWTPayload) => {
  const appointmentData = await prisma.appointment.findUnique({where: {id: appointmentId}, include: {doctor: true}});
  if (!appointmentData) throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");

  if (user.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email)) throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment");
  }
  const result = await prisma.appointment.update({where: {id: appointmentId}, data: {status: status}});

  return result;
};

const getAllFromDB = async (filters: any, options: IPaginationOptions) => {
  const {limit, page} = paginationHelper.calculatePagination(options);
  const {patientEmail, doctorEmail, ...filterData} = filters;

  const andConditions = [];

  if (patientEmail) andConditions.push({patient: {email: patientEmail}});
  else if (doctorEmail) andConditions.push({doctor: {email: doctorEmail}});

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {[key]: {equals: (filterData as any)[key]}};
      }),
    });
  }

  // console.dir(andConditions, { depth: Infinity })
  const whereConditions: Prisma.AppointmentWhereInput = andConditions.length > 0 ? {AND: andConditions} : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: options.sortBy && options.sortOrder ? {[options.sortBy]: options.sortOrder} : {createdAt: "desc"},
    include: {doctor: true, patient: true},
  });

  const total = await prisma.appointment.count({where: whereConditions});

  return {meta: {total, page, limit}, data: result};
};

const cancelUnpaidAppointments = async () => {
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);

  const unPaidAppointments = await prisma.appointment.findMany({
    where: {createdAt: {lte: thirtyMinAgo}, paymentStatus: PaymentStatus.UNPAID},
  });

  const appointmentIdsToCancel = unPaidAppointments.map((appointment) => appointment.id);

  await prisma.$transaction(async (tnx) => {
    await tnx.payment.deleteMany({where: {appointmentId: {in: appointmentIdsToCancel}}});

    await tnx.appointment.deleteMany({where: {id: {in: appointmentIdsToCancel}}});

    for (const unPaidAppointment of unPaidAppointments) {
      await tnx.doctorSchedules.update({
        where: {doctorId_scheduleId: {doctorId: unPaidAppointment.doctorId, scheduleId: unPaidAppointment.scheduleId}},
        data: {isBooked: false},
      });
    }
  });
};

const createAppointmentWithPayLater = async (user: IJWTPayload, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({where: {email: user?.email}});

  const doctorData = await prisma.doctor.findUniqueOrThrow({where: {id: payload.doctorId, isDeleted: false}});

  await prisma.doctorSchedules.findFirstOrThrow({where: {doctorId: doctorData.id, scheduleId: payload.scheduleId, isBooked: false}});

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {patient: true, doctor: true, schedule: true},
    });

    await tnx.doctorSchedules.update({
      where: {doctorId_scheduleId: {doctorId: doctorData.id, scheduleId: payload.scheduleId}},
      data: {isBooked: true},
    });

    const transactionId = uuidv4();

    await tnx.payment.create({data: {appointmentId: appointmentData.id, amount: doctorData.appointmentFee, transactionId}});

    return appointmentData;
  });

  return result;
};

const initiatePaymentForAppointment = async (user: IJWTPayload, appointmentId: string) => {
  const patientData = await prisma.patient.findUniqueOrThrow({where: {email: user?.email}});

  const appointment = await prisma.appointment.findUnique({
    where: {id: appointmentId, patientId: patientData.id},
    include: {payment: true, doctor: true},
  });

  if (!appointment) throw new ApiError(httpStatus.BAD_REQUEST, "Appointment not found or unauthorized");

  if (appointment.paymentStatus !== PaymentStatus.UNPAID) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment already completed for this appointment");
  }

  if (appointment.status === AppointmentStatus.CANCEL) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot pay for cancelled appointment");
  }

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user?.email || "",
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {name: `Appointment with ${appointment.doctor.name}`},
          unit_amount: appointment.payment!.amount * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {appointmentId: appointment.id, paymentId: appointment.payment!.id},

    success_url: config.payment_success_url,
    cancel_url: config.payment_cancel_url,
  });

  return {paymentUrl: session.url};
};

export const AppointmentService = {
  createAppointment,
  getMyAppointment,
  updateAppointmentStatus,
  getAllFromDB,
  cancelUnpaidAppointments,
  createAppointmentWithPayLater,
  initiatePaymentForAppointment,
};
