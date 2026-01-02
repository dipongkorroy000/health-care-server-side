import { Specialties } from "@prisma/client";
import { createSpecialty } from "./specialties.interface";
export declare const SpecialtiesService: {
    insertIntoDB: (payload: createSpecialty, file: Express.Multer.File | undefined) => Promise<{
        id: string;
        title: string;
        icon: string;
    }>;
    getAllFromDB: () => Promise<Specialties[]>;
    deleteFromDB: (id: string) => Promise<Specialties>;
};
//# sourceMappingURL=specialties.service.d.ts.map