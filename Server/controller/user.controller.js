import User from "../models/user.modal.js";
import AppError from "../utils/error.utils.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
};

// REGISTER
const register = async (req, res, next) => {
    const { fullName, email, mobile, age, password } = req.body;

    if (!fullName || !email || !mobile || !age || !password) {
        return next(new AppError('All fields are required', 400));
    }

    if (password.length !== 4) {
        return next(new AppError('Password must be exactly 4 digits', 400));
    }

    const emailExists = await User.findOne({ email });
    const mobileExists = await User.findOne({ mobile });

    if (emailExists) {
        return next(new AppError('Email already exists', 400));
    }
    if (mobileExists) {
        return next(new AppError('Mobile number already exists. Please try another mobile number or login with this mobile number.', 400));
    }

    const user = await User.create({
        fullName,
        email,
        mobile,
        age,
        password,
    });

    if (!user) {
        return next(new AppError('Failed to register user', 400));
    }

    user.password = undefined;

    const token = user.generateJWTToken();

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
    });
};

// LOGIN
const login = async (req, res, next) => {
    try {
        const { email, mobile, password } = req.body;

        if ((!email && !mobile) || !password) {
            return next(new AppError('All fields are required', 400));
        }

        if (password.length !== 4) {
            return next(new AppError('Password must be exactly 4 digits', 400));
        }

        // Find user by email or mobile
        const user = await User.findOne({
            $or: [{ email }, { mobile }],
        }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError('Invalid credentials', 400));
        }

        const token = user.generateJWTToken();
        user.password = undefined;

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user,
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// LOGOUT
const logout = (req, res) => {
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: 'User logged out successfully',
    });
};

// GET PROFILE
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            message: 'User details',
            user,
        });
    } catch (e) {
        return next(new AppError('Failed to fetch profile details', 500));
    }
};

// UPDATE USER
const updateUser = async (req, res, next) => {
    const { fullName, age, mobile } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        return next(new AppError('User does not exist', 400));
    }

    if (fullName) {
        user.fullName = fullName;
    }
    if (age) {
        user.age = age;
    }
    if (mobile) {
        user.mobile = mobile;
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: 'User details updated successfully!',
    });
};

export { register, login, logout, getProfile, updateUser };