import { Doctor } from "@prisma/client";
import { IPaginationOptions } from "../../helper/paginationHelper";
import { IDoctorFilterRequest, IDoctorUpdateInput } from "./doctor.interface";
export declare const DoctorService: {
    getAllFromDB: (filters: IDoctorFilterRequest, options: IPaginationOptions) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
        };
        data: ({
            doctorSchedules: ({
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
            reviews: {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                doctorId: string;
                patientId: string;
                appointmentId: string;
                rating: number;
                comment: string | null;
            }[];
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
        })[];
    }>;
    updateIntoDB: (id: string, payload: Partial<IDoctorUpdateInput>) => Promise<({
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
    getByIdFromDB: (id: string) => Promise<Doctor | null>;
    deleteFromDB: (id: string) => Promise<Doctor>;
    softDelete: (id: string) => Promise<Doctor>;
    getAISuggestions: (payload: {
        symptoms: string;
    }) => Promise<any>;
};
//# sourceMappingURL=doctor.service.d.ts.map