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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../configs/config");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }
        if (username.length < 3) {
            return res.status(400).json({
                message: 'Username should be atleast 3 character long',
            });
        }
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid Gmail',
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be greater than the length of 6'
            });
        }
        // const existingUserByEmail = await User.findOne({ $or: [{ email: email }, { username: username }] });
        const existingUserByEmail = yield user_1.User.findOne({ email: email });
        if (existingUserByEmail) {
            return res.status(400).json({
                message: 'Email already exists',
            });
        }
        const existingUserByUsername = yield user_1.User.findOne({ username: username });
        if (existingUserByUsername) {
            return res.status(400).json({
                message: 'Username already exists',
            });
        }
        const saltRounds = 10;
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        const newUser = new user_1.User({
            username: username,
            email: email,
            password: hashedPassword,
            profileImage: profileImage,
        });
        yield newUser.save();
        const token = yield jsonwebtoken_1.default.sign({ userId: newUser._id }, config_1.ENV_VARS.JWT_SECRET, { expiresIn: '15d' });
        const _a = newUser.toObject(), { password: _password } = _a, userWithoutPasword = __rest(_a, ["password"]);
        res.status(201).json({
            user: Object.assign(Object.assign({}, userWithoutPasword), { token })
        });
    }
    catch (error) {
        console.log('Error in register controller: ', error);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid Gmail',
            });
        }
        const user = yield user_1.User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                message: 'Invalid credentials',
            });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Invalid credentials',
            });
        }
        const token = yield jsonwebtoken_1.default.sign({ userId: user._id }, config_1.ENV_VARS.JWT_SECRET, { expiresIn: '15d' });
        const userWithoutPasword = yield user_1.User.findOne({ email: email }).select('-password');
        res.status(200).json({
            user: Object.assign(Object.assign({}, userWithoutPasword === null || userWithoutPasword === void 0 ? void 0 : userWithoutPasword.toObject()), { token })
        });
    }
    catch (error) {
        console.log("Error in login controller: ", error);
        res.status(500).json({
            error: "Failed to login"
        });
    }
});
exports.login = login;
