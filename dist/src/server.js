"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const seed_1 = __importDefault(require("./app/helper/seed"));
let server = null;
async function startServer() {
    try {
        // Seed super admin
        await (0, seed_1.default)();
        // Start the server
        server = http_1.default.createServer(app_1.default);
        server.listen(config_1.default.port, () => console.log(`🚀 Server is running on port ${config_1.default.port}`));
        handleProcessEvents();
    }
    catch (error) {
        // console.error("❌ Error during server startup:", error);
        process.exit(1);
    }
}
/**
 * Gracefully shutdown the server and close database connections.
 * @param {string} signal - The termination signal received.
 */
async function gracefulShutdown(signal) {
    console.warn(`🔄 Received ${signal}, shutting down gracefully...`);
    if (server) {
        server.close(async () => {
            console.log("✅ HTTP server closed.");
            try {
                console.log("Server shutdown complete.");
            }
            catch (error) {
                console.error("❌ Error during shutdown:", error);
            }
            process.exit(0);
        });
    }
    else
        process.exit(0);
}
/**
 * Handle system signals and unexpected errors.
 */
function handleProcessEvents() {
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("uncaughtException", (error) => {
        console.error("💥 Uncaught Exception:", error);
        gracefulShutdown("uncaughtException");
    });
    process.on("unhandledRejection", (reason) => {
        console.error("💥 Unhandled Rejection:", reason);
        gracefulShutdown("unhandledRejection");
    });
}
// Start the application
startServer();
//# sourceMappingURL=server.js.map