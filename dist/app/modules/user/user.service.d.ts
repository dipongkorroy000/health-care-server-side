import { UserStatus } from "@prisma/client";
import { IPaginationOptions } from "../../helper/paginationHelper";
import { createAdminInput, createDoctorInput, createPatientInput } from "./user.interface";
import { IJWTPayload } from "../../types/reqUser";
export declare const UserService: {
    createPatient: (payload: createPatientInput, file: Express.Multer.File | undefined) => Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        profilePhoto: string | null;
        contactNumber: string | null;
        address: string | null;
        isDeleted: boolean;
        updatedAt: Date;
    }>;
    getAllUser: (filters: any, options: IPaginationOptions) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            needPasswordChange: boolean;
            status: import("@prisma/client").$Enums.UserStatus;
        }[];
    }>;
    createDoctor: (payload: createDoctorInput, file: Express.Multer.File | undefined) => Promise<({
        doctorSpecialties: ({
            specialties: {
                id: string;
                title: string;
                icon: string;
            };
        } & {
            doctorId: string;
            specialtiesId: string;
        })[];
    } & {
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        profilePhoto: string | null;
        contactNumber: string;
        address: string | null;
        isDeleted: boolean;
        updatedAt: Date;
        registrationNumber: string;
        experience: number;
        gender: import("@prisma/client").$Enums.Gender;
        appointmentFee: number;
        qualification: string;
        currentWorkingPlace: string;
        designation: string;
        averageRating: number;
    }) | null>;
    createAdmin: (payload: createAdminInput, file: Express.Multer.File | undefined) => Promise<{
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        profilePhoto: string | null;
        contactNumber: string;
        isDeleted: boolean;
        updatedAt: Date;
    }>;
    getMyProfile: (user: IJWTPayload) => Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        needPasswordChange: boolean;
        status: import("@prisma/client").$Enums.UserStatus;
    } | {
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        needPasswordChange: boolean;
        status: import("@prisma/client").$Enums.UserStatus;
    } | {
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        profilePhoto: string | null;
        contactNumber: string | null;
        address: string | null;
        isDeleted: boolean;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.UserRole;
        needPasswordChange: boolean;
        status: import("@prisma/client").$Enums.UserStatus;
    } | {
        createdAt: Date;
        name: string;
        id: string;
        email: string;
        profilePhoto: string | null;
        contactNumber: string;
        isDeleted: boolean;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.UserRole;
        needPasswordChange: boolean;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
    changeProfileStatus: (id: string, payload: {
        status: UserStatus;
    }) => Promise<{
        createdAt: Date;
        id: string;
        email: string;
        updatedAt: Date;
        password: string;
        role: import("@prisma/client").$Enums.UserRole;
        needPasswordChange: boolean;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
    updateMyProfile: (user: IJWTPayload, payload: any, file: Express.Multer.File | undefined) => Promise<{}>;
};
//# sourceMappingURL=user.service.d.ts.map