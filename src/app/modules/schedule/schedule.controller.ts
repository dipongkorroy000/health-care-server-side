import {Request, Response} from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import {ScheduleService} from "./schedule.service";
import pick from "../../helper/pick";
import type {IJWTPayload} from "../../types/reqUser";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await ScheduleService.insertIntoDB(payload);

  sendResponse(res, {
    status: 201,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request & {user?: IJWTPayload}, res: Response) => {
  const user = req.user;

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["startDate", "endDate"]);

  const result = await ScheduleService.getAllFromDB(user as IJWTPayload, filters, options);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Schedule retrieved successfully!",
    data: result,
  });
});

const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.deleteScheduleFromDB(req.params.id as string);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Schedule deleted successfully!",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.getByIdFromDB(req.params.id as string);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Schedule retrieved successfully",
    data: result,
  });
});

export const ScheduleController = {
  insertIntoDB,
  getAllFromDB,
  deleteScheduleFromDB,
  getByIdFromDB,
};
