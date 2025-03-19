import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { ENV_VARS } from "../configs/config";

export const veryfyToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(403).json({
                message: "No authenticated token provided, access denied"
            });
            return;
        }
        const decode = Jwt.verify(token, ENV_VARS.JWT_SECRET) as { userId: string };
        req.user = decode;
        next();
    } catch (error) {
        res.status(500).json({
            message: "Invalid Token"
        });
    }
}