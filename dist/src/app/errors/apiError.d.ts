declare class ApiError extends Error {
    status: number;
    constructor(status: number, message: string | undefined, stack?: string);
}
export default ApiError;
//# sourceMappingURL=apiError.d.ts.map