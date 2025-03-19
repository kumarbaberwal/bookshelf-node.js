"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./configs/config");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const db_1 = require("./databases/db");
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hi.. Kumar"
    });
});
app.use('/auth', authRoutes_1.default);
app.use('/books', bookRoutes_1.default);
const PORT = config_1.ENV_VARS.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
    (0, db_1.connectDB)();
});
