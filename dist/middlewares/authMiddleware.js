"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.veryfyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../configs/config");
const veryfyToken = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(403).json({
                message: "No authenticated token provided, access denied"
            });
            return;
        }
        const decode = jsonwebtoken_1.default.verify(token, config_1.ENV_VARS.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch (error) {
        res.status(500).json({
            message: "Invalid Token"
        });
    }
};
exports.veryfyToken = veryfyToken;
