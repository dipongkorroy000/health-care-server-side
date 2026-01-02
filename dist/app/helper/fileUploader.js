"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../../config"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), "/uploads")); // cwd -> current working directory, /home/dipongkorroy/coding/health-care-server-side
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const uploadToCloudinary = async (file) => {
    // Configuration
    cloudinary_1.v2.config({
        cloud_name: config_1.default.cloudinary.cloud_name,
        api_key: config_1.default.cloudinary.api_key,
        api_secret: config_1.default.cloudinary.api_secret, // Click 'View API Keys' above to copy your API secret
    });
    // Upload an image
    const uploadResult = await cloudinary_1.v2.uploader
        .upload(file.path, {
        public_id: file.filename,
    })
        .catch((error) => {
        console.log(error);
    });
    return uploadResult;
};
exports.fileUploader = { upload, uploadToCloudinary };
//# sourceMappingURL=fileUploader.js.map