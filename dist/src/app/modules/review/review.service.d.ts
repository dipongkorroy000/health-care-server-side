import { IJWTPayload } from "../../types/reqUser";
import { IPaginationOptions } from "../../helper/paginationHelper";
export declare const ReviewService: {
    insertIntoDB: (user: IJWTPayload, payload: any) => Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        doctorId: string;
        patientId: string;
        appointmentId: string;
        rating: number;
        comment: string | null;
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
            doctorId: string;
            patientId: string;
            appointmentId: string;
            rating: number;
            comment: string | null;
        })[];
    }>;
};
//# sourceMappingURL=review.service.d.ts.map