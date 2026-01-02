import { IJWTPayload } from "../../types/reqUser";
export declare const MetaService: {
    fetchDashboardMetaData: (user: IJWTPayload) => Promise<{
        patientCount: number;
        doctorCount: number;
        adminCount: number;
        appointmentCount: number;
        paymentCount: number;
        totalRevenue: import("@prisma/client").Prisma.GetPaymentAggregateType<{
            _sum: {
                amount: true;
            };
            where: {
                status: "PAID";
            };
        }>;
        barChartData: unknown;
        pieChartData: {
            status: import("@prisma/client").$Enums.AppointmentStatus;
            count: number;
        }[];
    } | {
        appointmentCount: number;
        reviewCount: number;
        patientCount: number;
        totalRevenue: import("@prisma/client").Prisma.GetPaymentAggregateType<{
            _sum: {
                amount: true;
            };
            where: {
                appointment: {
                    doctorId: string;
                };
                status: "PAID";
            };
        }>;
        formattedAppointmentStatusDistribution: {
            status: import("@prisma/client").$Enums.AppointmentStatus;
            count: number;
        }[];
    } | {
        appointmentCount: number;
        prescriptionCount: number;
        reviewCount: number;
        formattedAppointmentStatusDistribution: {
            status: import("@prisma/client").$Enums.AppointmentStatus;
            count: number;
        }[];
    }>;
};
//# sourceMappingURL=meta.service.d.ts.map