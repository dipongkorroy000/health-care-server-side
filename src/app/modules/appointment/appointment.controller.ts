import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/reqUser";

const createAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
  const result = await AppointmentService.createAppointment(req.user as IJWTPayload, req.body);

  sendResponse(res, {
    status: 201,
    success: true,
    message: "Appointment created successfully!",
    data: result,
  });
});

export const AppointmentController = { createAppointment };
