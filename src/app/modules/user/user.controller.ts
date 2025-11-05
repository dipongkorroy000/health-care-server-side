import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import status from "http-status";
import { IJWTPayload } from "../../types/reqUser";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req.body, req.file);

  sendResponse(res, { status: 201, success: true, message: "Patient created successfully", data: result });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["status", "role", "email", "searchTerm"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await UserService.getAllUser(filters, options);

  sendResponse(res, { status: 200, success: true, message: "Users retrieved successfully", data: result });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createDoctor(req.body, req.file);

  sendResponse(res, { status: 201, success: true, message: "Doctor Created successfuly!", data: result });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req.body, req.file);

  sendResponse(res, { status: 201, success: true, message: "Admin Created successfuly!", data: result });
});

const getMyProfile = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
  const user = req.user;

  const result = await UserService.getMyProfile(user as IJWTPayload);

  sendResponse(res, { status: status.OK, success: true, message: "My profile data fetched!", data: result });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserService.changeProfileStatus(id as string, req.body);

  sendResponse(res, { status: status.OK, success: true, message: "Users profile status changed!", data: result });
});

export const UserController = { createPatient, getAllUser, createDoctor, createAdmin, getMyProfile, changeProfileStatus };
