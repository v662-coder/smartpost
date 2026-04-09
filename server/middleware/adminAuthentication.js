import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import HttpStatus from "../constants/http-status.constant.js";
import ToastyConstant from "../constants/toasty.constant.js";
import UserModel from "../models/userSchema.js";

const adminAuthentication = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        if (authorization && authorization.startsWith("Bearer ")) {

            const authorizationToken = authorization.split(" ")[1];
            if (authorizationToken) {

                const { userId } = jwt.verify(authorizationToken, process.env.JWT_SECRET_KEY)
                if (Types.ObjectId.isValid(userId)) {

                    const user = await UserModel.findById(userId).select("-password");
                    if (user.role === "admin") {
                        req.admin = user
                        next();
                    } else {
                        return res.status(HttpStatus.FORBIDDEN).json({
                            status: false,
                            message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR
                        });
                    }

                }  else {
                        return res.status(HttpStatus.FORBIDDEN).json({
                            status: false,
                            message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR
                        });
                    }

            } else {
                        return res.status(HttpStatus.UNAUTHORIZED).json({
                            status: false,
                            message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR
                        });
                    }
        } else {
            throw new Error("Unauthorized User");
        }

    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ "status": false, "message":ToastyConstant.SERVER.INTERNAL_SERVER_ERROR, "error": error });
    }
}

export default adminAuthentication;