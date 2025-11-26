import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/reqUser";
import pick from "../../helper/pick";
import status from "http-status";

const createAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
  const result = await AppointmentService.createAppointment(req.user as IJWTPayload, req.body);

  sendResponse(res, { status: 201, success: true, message: "Appointment created successfully!", data: result });
});

const getMyAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["status", "paymentStatus"]);
  const user = req.user;

  const result = await AppointmentService.getMyAppointment(user as IJWTPayload, filters, options);

  sendResponse(res, { status: 200, success: true, message: "Appointment fetched successfully!", data: result.data, meta: result.meta });
});

const updateAppointmentStatus = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;

  const result = await AppointmentService.updateAppointmentStatus(id as string, status, user as IJWTPayload);

  sendResponse(res, { status: 200, success: true, message: "Appointment updated successfully!", data: result });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["status", "paymentStatus", "patientEmail", "doctorEmail"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AppointmentService.getAllFromDB(filters, options);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Appointment retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const AppointmentController = { createAppointment, getMyAppointment, updateAppointmentStatus, getAllFromDB };
