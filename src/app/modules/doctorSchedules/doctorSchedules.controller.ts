import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedules.service";
import { IJWTPayload } from "../../types/reqUser";
import status from "http-status";
import pick from "../../helper/pick";

const insertIntoDB = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
  const user = req.user;
  const result = await DoctorScheduleService.insertIntoDB(user as IJWTPayload, req.body);

  sendResponse(res, {
    status: 201,
    success: true,
    message: "Doctor Schedule created successfully!",
    data: result,
  });
});

const getMySchedule = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
  const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const user = req.user;

  const result = await DoctorScheduleService.getMySchedule(filters, options, user as IJWTPayload);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "My Schedule fetched successfully!",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
  const user = req.user;
  const { id } = req.params;

  const result = await DoctorScheduleService.deleteFromDB(user as IJWTPayload, id as string);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "My Schedule deleted successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "isBooked", "doctorId"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await DoctorScheduleService.getAllFromDB(filters, options);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Doctor Schedule retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const DoctorScheduleController = { insertIntoDB, getMySchedule, deleteFromDB, getAllFromDB };
