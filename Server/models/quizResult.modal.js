import { Schema, model } from "mongoose";

const quizResultSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    score: {
        type: Number,
        default: 0,
    },
    timeTaken: {
        type: Number,
        default: 0,
    },
    attemptedGames: [{
        mcqSetId: {
            type: Schema.Types.ObjectId,
            ref: "MCQSet"
        },
        date: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

const QuizResult = model("QuizResult", quizResultSchema);

export default QuizResult;