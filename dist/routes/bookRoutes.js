"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const bookControllers_1 = require("../controllers/bookControllers");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.veryfyToken, bookControllers_1.bookController);
router.get('/', authMiddleware_1.veryfyToken, bookControllers_1.getAllBooks);
router.delete('/:id', authMiddleware_1.veryfyToken, bookControllers_1.deleteBook);
router.get('/user', authMiddleware_1.veryfyToken, bookControllers_1.getAllBooksByUser);
exports.default = router;
