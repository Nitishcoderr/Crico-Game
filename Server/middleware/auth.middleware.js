import jwt from "jsonwebtoken";
import AppError from "../utils/error.utils.js";
import User from "../models/user.modal.js";

const isLoggedIn = async (req, res, next) => {
    try {
        // Get token from cookies
        const { token } = req.cookies;

        if (!token) {
            return next(new AppError('Please login to access this resource', 401));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new AppError('User not found', 401));
        }

        // Set user in request
        req.user = user;
        next();
    } catch (error) {
        return next(new AppError('Authentication failed', 401));
    }
};

const authorizedRoles = (...roles) => async (req, res, next) => {
    const currentUserRole = req.user.role;
    if (!roles.includes(currentUserRole)) {
        return next(new AppError('You dont have access.', 403));
    }
    next();
};

export {
    isLoggedIn,
    authorizedRoles
};