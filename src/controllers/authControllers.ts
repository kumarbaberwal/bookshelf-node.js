import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { ENV_VARS } from "../configs/config";

export const register = async (req: Request, res: Response): Promise<any> => {
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
        const existingUserByEmail = await User.findOne({ email: email });

        if (existingUserByEmail) {
            return res.status(400).json({
                message: 'Email already exists',
            });
        }


        const existingUserByUsername = await User.findOne({ username: username });

        if (existingUserByUsername) {
            return res.status(400).json({
                message: 'Username already exists',
            });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            profileImage: profileImage,
        });

        await newUser.save();


        const token = await JWT.sign({ userId: newUser._id }, ENV_VARS.JWT_SECRET, { expiresIn: '15d' });

        const { password: _password, ...userWithoutPasword } = newUser.toObject();

        res.status(201).json({
            user: {
                ...userWithoutPasword,
                token
            }
        })
    } catch (error) {
        console.log('Error in register controller: ', error);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
}


export const login = async (req: Request, res: Response): Promise<any> => {
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

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                message: 'Invalid credentials',
            });
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Invalid credentials',
            });
        }

        const token = await JWT.sign({ userId: user._id }, ENV_VARS.JWT_SECRET, { expiresIn: '15d' });

        const userWithoutPasword = await User.findOne({ email: email }).select('-password');

        res.status(200).json({
            user: {
                ...userWithoutPasword?.toObject(),
                token,
            }
        })
    } catch (error) {
        console.log("Error in login controller: ", error);
        res.status(500).json({
            error: "Failed to login"
        });
    }
}