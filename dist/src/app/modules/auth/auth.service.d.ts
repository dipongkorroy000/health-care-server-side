import { Login } from "./auth.interface";
export declare const AuthService: {
    login: (payload: Login) => Promise<{
        accessToken: string;
        refreshToken: string;
        needPasswordChange: boolean;
    }>;
    refreshToken: (token: string) => Promise<{
        accessToken: Promise<string>;
        refreshToken: Promise<string>;
        needPasswordChange: boolean;
    }>;
    changePassword: (user: any, payload: any) => Promise<{
        message: string;
    }>;
    resetPassword: (token: string | null, payload: {
        email?: string;
        password: string;
    }, user?: {
        email: string;
    }) => Promise<void>;
    getMe: (session: any) => Promise<{
        createdAt: Date;
        admin: {
            name: string;
            id: string;
            email: string;
            profilePhoto: string | null;
            contactNumber: string;
            isDeleted: boolean;
        } | null;
        doctor: {
            createdAt: Date;
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
        } | null;
        id: string;
        email: string;
        updatedAt: Date;
        Patient: {
            createdAt: Date;
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
            name: string;
            id: string;
            email: string;
            profilePhoto: string | null;
            address: string | null;
            isDeleted: boolean;
            updatedAt: Date;
        } | null;
        role: import("@prisma/client").$Enums.UserRole;
        needPasswordChange: boolean;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
    forgotPassword: (payload: {
        email: string;
    }) => Promise<void>;
};
//# sourceMappingURL=auth.service.d.ts.map