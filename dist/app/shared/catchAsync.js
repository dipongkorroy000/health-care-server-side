"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = catchAsync;
// fot this ,, try catch and next function every time call avoid
//# sourceMappingURL=catchAsync.js.map