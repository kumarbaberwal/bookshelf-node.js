"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJob = void 0;
const cron_1 = __importDefault(require("cron"));
const https_1 = __importDefault(require("https"));
const config_1 = require("../configs/config");
exports.cronJob = new cron_1.default.CronJob('*/14 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    https_1.default.get(config_1.ENV_VARS.API_URL, (res) => {
        if (res.statusCode === 200) {
            console.log("GET request sent successfully");
        }
        else {
            console.log("GET request failed: ", res.statusCode);
        }
    }).on('error', (e) => {
        console.log('Error while sending request: ', e);
    });
}));
