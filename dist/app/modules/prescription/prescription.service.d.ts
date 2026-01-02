import { Prescription } from "@prisma/client";
import { IJWTPayload } from "../../types/reqUser";
import { IPaginationOptions } from "../../helper/paginationHelper";
export declare const PrescriptionService: {
    createPrescription: (user: IJWTPayload, payload: Partial<Prescription>) => Promise<{
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
        doctorId: string;
        patientId: string;
        appointmentId: string;
        instructions: string;
        followUpDate: Date | null;
    }>;
    patientPrescription: (user: IJWTPayload, options: IPaginationOptions) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
        };
        data: ({
            appointment: {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.AppointmentStatus;
                doctorId: string;
                scheduleId: string;
                videoCallingId: string;
                paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
                patientId: string;
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
            doctorId: string;
            patientId: string;
            appointmentId: string;
            instructions: string;
            followUpDate: Date | null;
        })[];
    }>;
};
//# sourceMappingURL=prescription.service.d.ts.map