import { Admin } from "@prisma/client";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../helper/paginationHelper";
export declare const AdminService: {
    getAllFromDB: (params: IAdminFilterRequest, options: IPaginationOptions) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: {
            createdAt: Date;
            name: string;
            id: string;
            email: string;
            profilePhoto: string | null;
            contactNumber: string;
            isDeleted: boolean;
            updatedAt: Date;
        }[];
    }>;
    getByIdFromDB: (id: string) => Promise<Admin | null>;
    updateIntoDB: (id: string, data: Partial<Admin>) => Promise<Admin>;
    deleteFromDB: (id: string) => Promise<Admin | null>;
    softDeleteFromDB: (id: string) => Promise<Admin | null>;
};
//# sourceMappingURL=admin.service.d.ts.map