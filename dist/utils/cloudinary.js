"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const config_1 = require("../configs/config");
cloudinary_1.v2.config({
    cloud_name: config_1.ENV_VARS.CLOUDINARY_CLOUD_NAME,
    api_key: config_1.ENV_VARS.CLOUDINARY_API_KEY,
    api_secret: config_1.ENV_VARS.CLOUDINARY_API_SECRET,
});
exports.default = cloudinary_1.v2;
