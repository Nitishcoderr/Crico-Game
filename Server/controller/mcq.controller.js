import MCQSet from "../models/mcq.modal.js";
import QuizResult from "../models/quizResult.modal.js";
import AppError from "../utils/error.utils.js";

// Create a new MCQ set
const createMCQSet = async (req, res, next) => {
    try {
        const { questions, scheduledDate } = req.body;
        const createdBy = req.user.id;
        if (!questions || !scheduledDate) {
            return next(new AppError("All fields are required", 400));
        }

        if (questions.length !== 6) {
            return next(new AppError("There must be exactly 6 questions", 400));
        }

        const mcqSet = await MCQSet.create({
            questions,
            scheduledDate,
            createdBy,
        });

        res.status(201).json({
            success: true,
            message: "MCQ set created successfully",
            mcqSet,
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// Update an MCQ set
const updateMCQSet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { questions, scheduledDate } = req.body;

        const mcqSet = await MCQSet.findById(id);

        if (!mcqSet) {
            return next(new AppError("MCQ set not found", 404));
        }

        if (questions) {
            if (questions.length !== 6) {
                return next(new AppError("There must be exactly 6 questions", 400));
            }
            mcqSet.questions = questions;
        }
        if (scheduledDate) mcqSet.scheduledDate = scheduledDate;

        await mcqSet.save();

        res.status(200).json({
            success: true,
            message: "MCQ set updated successfully",
            mcqSet,
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// Delete an MCQ set
const deleteMCQSet = async (req, res, next) => {
    try {
        const { id } = req.params;

        const mcqSet = await MCQSet.findByIdAndDelete(id);

        if (!mcqSet) {
            return next(new AppError("MCQ set not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "MCQ set deleted successfully",
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// Get a specific question by index
const getQuestionByIndex = async (req, res, next) => {
    try {
        const { index } = req.params;
        const { mcqSetId } = req.query; // Get mcqSetId from query params

        if (!mcqSetId) {
            return next(new AppError("MCQ set ID is required", 400));
        }

        // Find the specific MCQ set
        const mcqSet = await MCQSet.findById(mcqSetId);

        if (!mcqSet) {
            return next(new AppError("MCQ set not found", 404));
        }

        if (index < 0 || index >= mcqSet.questions.length) {
            return next(new AppError("Invalid question index", 400));
        }

        const question = mcqSet.questions[index];

        res.status(200).json({
            success: true,
            message: "Question fetched successfully",
            question,
            currentIndex: parseInt(index),
            totalQuestions: mcqSet.questions.length,
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// Get all MCQ sets with attempt status
const getAllMCQs = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(new AppError("User not authenticated", 401));
        }

        // Fetch all MCQ sets from the database
        const mcqSets = await MCQSet.find().populate("createdBy", "fullName email");

        if (!mcqSets || mcqSets.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No MCQ sets found",
                mcqSets: []
            });
        }

        // Get user's quiz result to check attempted games
        const quizResult = await QuizResult.findOne({ userId: req.user.id });
        const attemptedGames = quizResult ? quizResult.attemptedGames.map(game => game.mcqSetId.toString()) : [];

        // Add hasPlayed status based on database
        const mcqSetsWithStatus = mcqSets.map(mcqSet => ({
            ...mcqSet.toObject(),
            hasPlayed: attemptedGames.includes(mcqSet._id.toString())
        }));

        res.status(200).json({
            success: true,
            message: "All MCQ sets fetched successfully",
            mcqSets: mcqSetsWithStatus,
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// Submit an answer
const submitAnswer = async (req, res, next) => {
    try {
        const { index, selectedAnswer, timeTaken, mcqSetId } = req.body;
        const userId = req.user.id;

        if (index === undefined || !selectedAnswer || !timeTaken || !mcqSetId) {
            return next(new AppError("All fields are required", 400));
        }

        // Find the specific MCQ set
        const mcqSet = await MCQSet.findById(mcqSetId);

        if (!mcqSet) {
            return next(new AppError("MCQ set not found", 404));
        }

        if (index < 0 || index >= mcqSet.questions.length) {
            return next(new AppError("Invalid question index", 400));
        }

        const question = mcqSet.questions[index];

        // Find existing quiz result for the user
        let quizResult = await QuizResult.findOne({ userId });

        // If no existing result, create new one
        if (!quizResult) {
            quizResult = new QuizResult({
                userId,
                score: 0,
                timeTaken: 0,
                attemptedGames: []
            });
        }

        // Check if this specific game is already attempted
        const isGameAttempted = quizResult.attemptedGames.some(
            game => game.mcqSetId.toString() === mcqSetId
        );

        if (isGameAttempted) {
            return next(new AppError("You have already attempted this game", 400));
        }

        const isLastQuestion = index === mcqSet.questions.length - 1;
        const isCorrectAnswer = question.correctAnswer === selectedAnswer;

        // If answer is wrong or it's the last question, mark the game as completed
        if (!isCorrectAnswer || isLastQuestion) {
            const finalScore = isCorrectAnswer ? mcqSet.questions.length : index;

            // Add game to attempted games with final score
            quizResult.attemptedGames.push({
                mcqSetId: mcqSet._id,
                date: mcqSet.scheduledDate,
                score: finalScore
            });

            // Update total score and time
            quizResult.score += finalScore;
            quizResult.timeTaken += timeTaken;
            await quizResult.save();

            return res.status(200).json({
                success: isCorrectAnswer,
                message: isCorrectAnswer ? "You won!" : "Better luck next time!",
                completed: true,
                totalScore: quizResult.score
            });
        }

        // If it's a correct answer and not the last question
        res.status(200).json({
            success: true,
            message: "Correct answer! Proceed to the next question.",
            nextIndex: parseInt(index) + 1,
            completed: false
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// Fetch the leaderboard
const getLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await QuizResult.aggregate([
            {
                $project: {
                    userId: 1,
                    score: 1,
                    timeTaken: 1,
                    gamesCount: { $size: "$attemptedGames" },
                    lastPlayedDate: { $arrayElemAt: ["$attemptedGames.date", -1] }
                }
            },
            {
                $group: {
                    _id: "$userId",
                    totalScore: { $sum: "$score" },
                    totalTime: { $sum: "$timeTaken" },
                    gamesPlayed: { $sum: "$gamesCount" },
                    lastPlayed: { $max: "$lastPlayedDate" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    fullName: "$userDetails.fullName",
                    email: "$userDetails.email",
                    mobile: "$userDetails.mobile",
                    totalScore: 1,
                    totalTime: 1,
                    gamesPlayed: 1,
                    lastPlayed: 1
                }
            },
            {
                $sort: { totalScore: -1, totalTime: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Leaderboard fetched successfully",
            leaderboard
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

export {
    createMCQSet,
    updateMCQSet,
    deleteMCQSet,
    getQuestionByIndex,
    submitAnswer,
    getLeaderboard,
    getAllMCQs,
};