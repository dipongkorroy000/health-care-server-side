"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const date_fns_1 = require("date-fns");
const paginationHelper_1 = require("../../helper/paginationHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const insertIntoDB = async (payload) => {
    const { startTime, endTime, startDate, endDate } = payload;
    const intervalTime = 30;
    const schedules = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    while (currentDate <= lastDate) {
        const startDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)((0, date_fns_1.format)(currentDate, "yyyy-MM-dd"), Number(startTime.split(":")[0]) // 11:00
        ), Number(startTime.split(":")[1])));
        const endDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)((0, date_fns_1.format)(lastDate, "yyyy-MM-dd"), Number(endTime.split(":")[0])), Number(endTime.split(":")[1])));
        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime; // 10:00
            const slotEndDateTime = (0, date_fns_1.addMinutes)(startDateTime, intervalTime); // 10:30
            const existingSchedule = await prisma_1.default.schedule.findFirst({
                where: { startDateTime: slotStartDateTime, endDateTime: slotEndDateTime },
            });
            if (!existingSchedule) {
                const result = await prisma_1.default.schedule.create({
                    data: { startDateTime: slotStartDateTime, endDateTime: slotEndDateTime },
                });
                schedules.push(result);
            }
            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedules;
};
const getAllFromDB = async (user, filters, options) => {
    const { page, limit, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { startDate: filterStartDateTime, endDate: filterEndDateTime } = filters;
    const andConditions = [];
    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({ AND: [{ startDateTime: { gte: filterStartDateTime } }, { endDateTime: { lte: filterEndDateTime } }] });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const doctorSchedules = await prisma_1.default.doctorSchedules.findMany({ where: { doctor: { email: user.email } }, select: { scheduleId: true } });
    const doctorScheduleIds = doctorSchedules.map((schedule) => schedule.scheduleId);
    const result = await prisma_1.default.schedule.findMany({
        where: { ...whereConditions, id: { notIn: doctorScheduleIds } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });
    const total = await prisma_1.default.schedule.count({ where: { ...whereConditions, id: { notIn: doctorScheduleIds } } });
    return { meta: { page, limit, total }, data: result };
};
const deleteScheduleFromDB = async (id) => {
    return await prisma_1.default.schedule.delete({ where: { id } });
};
const getByIdFromDB = async (id) => {
    const result = await prisma_1.default.schedule.findUnique({ where: { id } });
    return result;
};
exports.ScheduleService = { insertIntoDB, getAllFromDB, deleteScheduleFromDB, getByIdFromDB };
//# sourceMappingURL=schedule.service.js.map