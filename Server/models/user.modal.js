// import { Schema, model } from "mongoose";
// import bcrypt from 'bcryptjs'
// import jwt from "jsonwebtoken";
// import crypto from 'crypto'


// const userSchema = new Schema(
//     {
//         username: {
//         type: String,
//         required: [true, "Please provide a username"],
//         unique: true,
//         },
//         email: {
//         type: String,
//         required: [true, "Please provide an email"],
//         unique: true,
//         },
//         mobile: {
//         type: String,
//         required: [true, "Please provide a mobile number"],
//         unique: true,
//         },
//         age: {
//         type: Number,
//         required: [true, "Please provide an age"],
//         },
//         password: {
//         type: String,
//         required: [true, "Please provide a password"],
//         minlength: 6,
//         select: false,
//         },
//         role: {
//         type: String,
//         enum: ['user', 'admin'],
//         default: 'user'
//         },
//         resetPasswordToken: String,
//         resetPasswordExpire: Date
//     },
//     {
//         timestamps: true,
//     }
// )

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return next()
//     }
//     this.password = await bcrypt.hash(this.password, 10);
// })


// const User = model('User', userSchema)

// export default User;

import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Please provide a full name"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
        },
        mobile: {
            type: String,
            required: [true, "Please provide a mobile number"],
            unique: true,
        },
        age: {
            type: Number,
            required: [true, "Please provide an age"],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 4,
            maxlength: 4, 
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to generate JWT token
userSchema.methods.generateJWTToken = function () {
    return jwt.sign({ id: this._id,role:this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

export default User;