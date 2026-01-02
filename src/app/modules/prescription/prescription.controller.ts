import {Request, Response} from "express";
import catchAsync from "../../shared/catchAsync";
import {PrescriptionService} from "./prescription.service";
import sendResponse from "../../shared/sendResponse";
import {IJWTPayload} from "../../types/reqUser";
import pick from "../../helper/pick";
import status from "http-status";

const createPrescription = catchAsync(async (req: Request & {user?: IJWTPayload}, res: Response) => {
  const result = await PrescriptionService.createPrescription(req.user as IJWTPayload, req.body);

  sendResponse(res, {status: 201, success: true, message: "prescription created successfully!", data: result});
});

const patientPrescription = catchAsync(async (req: Request & {user?: IJWTPayload}, res: Response) => {
  const user = req.user;
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PrescriptionService.patientPrescription(user as IJWTPayload, options);
  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Prescription fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const PrescriptionController = {createPrescription, patientPrescription};
