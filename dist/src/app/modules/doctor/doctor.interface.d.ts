import { Gender } from "@prisma/client";
export type IDoctorUpdateInput = {
    email: string;
    contactNumber: string;
    gender: Gender;
    appointmentFee: number;
    name: string;
    address: string;
    registrationNumber: string;
    experience: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    isDeleted: boolean;
    specialties?: string[];
    removeSpecialties?: string[];
};
export type IDoctorFilterRequest = {
    searchTerm?: string | undefined;
    email?: string | undefined;
    contactNumber?: string | undefined;
    gender?: string | undefined;
    specialties?: string | undefined;
};
export type ISpecialties = {
    specialtiesId: string;
    isDeleted?: null;
};
//# sourceMappingURL=doctor.interface.d.ts.map