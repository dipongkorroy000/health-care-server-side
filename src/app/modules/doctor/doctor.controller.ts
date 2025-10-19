import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../shared/sendResponse";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["email", "contactNumber", "gender", "appointmentFee", "specialties", "searchTerm"]);

  const result = await DoctorService.getAllFromDB(filters, options);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Doctor fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.updateIntoDB(req.params.id as string, req.body);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Doctor updated successfully!",
    data: result,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getByIdFromDB(req.params.id as string);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.deleteFromDB(req.params.id as string);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.softDelete(req.params.id as string);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

const getAISuggestions = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getAISuggestions(req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "AI suggestions fetched successfully",
    data: result,
  });
});

export const DoctorController = { getAllFromDB, updateIntoDB, getByIdFromDB, deleteFromDB, softDelete, getAISuggestions };
