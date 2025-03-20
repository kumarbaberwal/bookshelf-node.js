"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJob = void 0;
const cron_1 = require("cron");
const https_1 = __importDefault(require("https"));
const config_1 = require("../configs/config");
exports.cronJob = new cron_1.CronJob('*/14 * * * *', function () {
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
});
