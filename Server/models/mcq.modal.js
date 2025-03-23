// // mcq.modal.js
// import { Schema, model } from "mongoose";

// const mcqSchema = new Schema(
//     {
//         question: {
//             type: String,
//             required: [true, "Please provide a question"],
//         },
//         options: {
//             type: [String],
//             required: [true, "Please provide options"],
//             validate: {
//                 validator: function (options) {
//                     return options.length === 4; // Ensure exactly 4 options
//                 },
//                 message: "There must be exactly 4 options",
//             },
//         },
//         correctAnswer: {
//             type: String,
//             required: [true, "Please provide the correct answer"],
//         },
//         scheduledDate: {
//             type: String, // Store as a string in DD-MM-YYYY format
//             required: true,
//             validate: {
//                 validator: function (value) {
//                     // Validate the date format (DD-MM-YYYY)
//                     return /^\d{2}-\d{2}-\d{4}$/.test(value);
//                 },
//                 message: "scheduledDate must be in DD-MM-YYYY format",
//             },
//         },
//         createdBy: {
//             type: Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// const MCQ = model("MCQ", mcqSchema);

// export default MCQ;

import { Schema, model } from "mongoose";

const questionSchema = new Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true, validate: [arrayLimit, "There must be exactly 4 options"] },
    correctAnswer: { type: String, required: true },
});

function arrayLimit(val) {
    return val.length === 4; // Ensure exactly 4 options
}

const mcqSetSchema = new Schema(
    {
        scheduledDate: {
            type: String, // Store as a string in DD-MM-YYYY format
            required: true,
            validate: {
                validator: function (value) {
                    // Validate the date format (DD-MM-YYYY)
                    return /^\d{2}-\d{2}-\d{4}$/.test(value);
                },
                message: "scheduledDate must be in DD-MM-YYYY format",
            },
        },
        questions: {
            type: [questionSchema],
            required: true,
            validate: [questionsLimit, "There must be exactly 6 questions"],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

function questionsLimit(val) {
    return val.length === 6; // Ensure exactly 6 questions
}

const MCQSet = model("MCQSet", mcqSetSchema);

export default MCQSet;