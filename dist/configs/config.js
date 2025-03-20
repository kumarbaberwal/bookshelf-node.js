"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_VARS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV_VARS = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || "mongodb+srv://kumar:kumar$12@cluster0.viepc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    JWT_SECRET: process.env.JWT_SECRET || '5BBwVDqSTF7zfLTFseSH6tzpTVy1UWr27xWHYNT2eMg=',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dbz9ocmoh',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "885253798614896",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "WOzUYMsqhFR_HGPta_LtgmoBoTA",
    API_URL: process.env.API_URL || "https://bookshelf-node-js.onrender.com",
};
