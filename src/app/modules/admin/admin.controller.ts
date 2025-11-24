import {NextFunction, Request, Response} from "express";
import {AdminService} from "./admin.service";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["name", "email", "searchTerm", "contactNumber"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AdminService.getAllFromDB(filters, options);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Admin data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getByIdFromDB(req.params.id as string);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Admin data fetched by id!",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateIntoDB(req.params.id as string, req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Admin data updated!",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.deleteFromDB(req.params.id as string);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Admin data deleted!",
    data: result,
  });
});

const softDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.softDeleteFromDB(req.params.id as string);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Admin data deleted!",
    data: result,
  });
});

export const AdminController = {getAllFromDB, getByIdFromDB, updateIntoDB, deleteFromDB, softDeleteFromDB};
