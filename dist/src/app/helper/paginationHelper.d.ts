export type IPaginationOptions = {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
};
export type IOptionsResult = {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
};
export declare const paginationHelper: {
    calculatePagination: (options: IPaginationOptions) => IOptionsResult;
};
//# sourceMappingURL=paginationHelper.d.ts.map