"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({ body: req.body });
        return next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = validateRequest;
//# sourceMappingURL=validateRequest.js.map