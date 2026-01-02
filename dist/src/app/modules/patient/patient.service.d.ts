import { Patient } from "@prisma/client";
import { IPatientFilterRequest } from "./patient.interface";
import { IPaginationOptions } from "../../helper/paginationHelper";
import { IJWTPayload } from "../../types/reqUser";
export declare const PatientService: {
    getAllFromDB: (filters: IPatientFilterRequest, options: IPaginationOptions) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
        };
        data: {
            createdAt: Date;
            name: string;
            id: string;
            email: string;
            profilePhoto: string | null;
            contactNumber: string | null;
            address: string | null;
            isDeleted: boolean;
            updatedAt: Date;
        }[];
    }>;
    getByIdFromDB: (id: string) => Promise<Patient | null>;
    softDelete: (id: string) => Promise<Patient | null>;
    updateIntoDB: (user: IJWTPayload, payload: any) => Promise<({
        patientHealthData: {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            gender: import("@prisma/client").$Enums.Gender;
            patientId: string;
            dateOfBirth: string;
            bloodGroup: import("@prisma/client").$Enums.BloodGroup;
            hasAllergies: boolean | null;
            hasDiabetes: boolean | null;
            height: string;
            weight: string;
            smokingStatus: boolean | null;
            dietaryPreferences: string | null;
            pregnancyStatus: boolean | null;
            mentalHealthHistory: string | null;
            immunizationStatus: string | null;
            hasPastSurgeries: boolean | null;
            recentAnxiety: boolean | null;
            recentDepression: boolean | null;
            maritalStatus: import("@prisma/client").$Enums.MaritalStatus;
        } | null;
        medicalReports: {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            patientId: string;
            reportName: string;
            reportLink: string;
        }[];
    } & {
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        profilePhoto: string | null;
        contactNumber: string | null;
        address: string | null;
        isDeleted: boolean;
        updatedAt: Date;
    }) | null>;
};
//# sourceMappingURL=patient.service.d.ts.map