import { IPaginationOptions } from "../../helper/paginationHelper";
import { Schedule } from "@prisma/client";
import { IJWTPayload } from "../../types/reqUser";
import { IFilterRequest, ISchedule } from "./schedule.interface";
export declare const ScheduleService: {
    insertIntoDB: (payload: ISchedule) => Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        startDateTime: Date;
        endDateTime: Date;
    }[]>;
    getAllFromDB: (user: IJWTPayload, filters: IFilterRequest, options: IPaginationOptions) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            startDateTime: Date;
            endDateTime: Date;
        }[];
    }>;
    deleteScheduleFromDB: (id: string) => Promise<{
        createdAt: Date;
        id: string;
        updatedAt: Date;
        startDateTime: Date;
        endDateTime: Date;
    }>;
    getByIdFromDB: (id: string) => Promise<Schedule | null>;
};
//# sourceMappingURL=schedule.service.d.ts.map