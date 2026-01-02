import { AppointmentStatus } from "@prisma/client";
import { IJWTPayload } from "../../types/reqUser";
import { IPaginationOptions } from "../../helper/paginationHelper";
export declare const AppointmentService: {
    createAppointment: (user: IJWTPayload, payload: {
        doctorId: string;
        scheduleId: string;
    }) => Promise<{
        paymentUrl: string | null;
    }>;
    getMyAppointment: (user: IJWTPayload, filters: any, options: IPaginationOptions) => Promise<{
        meta: {
            total: number;
            limit: number;
            page: number;
        };
        data: ({
            prescription: {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                doctorId: string;
                patientId: string;
                appointmentId: string;
                instructions: string;
                followUpDate: Date | null;
            } | null;
            review: {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                doctorId: string;
                patientId: string;
                appointmentId: string;
                rating: number;
                comment: string | null;
            } | null;
            schedule: {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                startDateTime: Date;
                endDateTime: Date;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            doctorId: string;
            scheduleId: string;
            videoCallingId: string;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            patientId: string;
        })[];
    }>;
    updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus, user: IJWTPayload) => Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        doctorId: string;
        scheduleId: string;
        videoCallingId: string;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        patientId: string;
    }>;
    getAllFromDB: (filters: any, options: IPaginationOptions) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
        };
        data: ({
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
            patient: {
                createdAt: Date;
                name: string;
                id: string;
                email: string;
                profilePhoto: string | null;
                contactNumber: string | null;
                address: string | null;
                isDeleted: boolean;
                updatedAt: Date;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            doctorId: string;
            scheduleId: string;
            videoCallingId: string;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            patientId: string;
        })[];
    }>;
    cancelUnpaidAppointments: () => Promise<void>;
    createAppointmentWithPayLater: (user: IJWTPayload, payload: any) => Promise<{
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
        patient: {
            createdAt: Date;
            name: string;
            id: string;
            email: string;
            profilePhoto: string | null;
            contactNumber: string | null;
            address: string | null;
            isDeleted: boolean;
            updatedAt: Date;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        doctorId: string;
        scheduleId: string;
        videoCallingId: string;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        patientId: string;
    }>;
    initiatePaymentForAppointment: (user: IJWTPayload, appointmentId: string) => Promise<{
        paymentUrl: string | null;
    }>;
};
//# sourceMappingURL=appointment.service.d.ts.map