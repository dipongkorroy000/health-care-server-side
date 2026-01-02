import { Prisma } from "@prisma/client";
import { IJWTPayload } from "../../types/reqUser";
import { IPaginationOptions } from "../../helper/paginationHelper";
export declare const DoctorScheduleService: {
    insertIntoDB: (user: IJWTPayload, payload: {
        scheduleIds: string[];
    }) => Promise<Prisma.BatchPayload>;
    getMySchedule: (filters: any, options: IPaginationOptions, user: IJWTPayload) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
        };
        data: ({
            schedule: {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                startDateTime: Date;
                endDateTime: Date;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            scheduleId: string;
            isBooked: boolean;
        })[];
    }>;
    deleteFromDB: (user: IJWTPayload, scheduleId: string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        scheduleId: string;
        isBooked: boolean;
    }>;
    getAllFromDB: (filters: any, options: IPaginationOptions) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
        };
        data: ({
            schedule: {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                startDateTime: Date;
                endDateTime: Date;
            };
            doctor: {
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
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            scheduleId: string;
            isBooked: boolean;
        })[];
    }>;
};
//# sourceMappingURL=doctorSchedules.service.d.ts.map