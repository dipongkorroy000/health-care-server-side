import { Gender } from "@prisma/client";

export type createPatientInput = {
  password: string;
  patient: { name: string; email: string; profilePhoto?: string; address?: string };
};

export type createDoctorInput = {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber: string;
    registrationNumber: string;
    address?: string;
    experience?: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    specialties: string[];
  };
};

export type createAdminInput = {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber: string;
  };
};
