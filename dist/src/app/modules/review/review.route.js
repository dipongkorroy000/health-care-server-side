"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get('/', review_controller_1.ReviewController.getAllFromDB);
router.post("/", (0, auth_1.default)(client_1.UserRole.PATIENT), review_controller_1.ReviewController.insertIntoDB);
exports.reviewRoutes = router;
//# sourceMappingURL=review.route.js.map