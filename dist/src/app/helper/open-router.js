"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../../config"));
exports.openai = new openai_1.default({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: config_1.default.open_router_api_KEY,
    defaultHeaders: {
        "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
    },
});
//# sourceMappingURL=open-router.js.map