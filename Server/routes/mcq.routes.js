import { Router } from "express";
import { authorizedRoles, isLoggedIn } from "../middleware/auth.middleware.js";
import { createMCQSet, deleteMCQSet, getAllMCQs, getLeaderboard, getQuestionByIndex, submitAnswer, updateMCQSet } from "../controller/mcq.controller.js";
const router = Router()


// Public routes
router.get("/all", isLoggedIn, getAllMCQs);

// Protected routes
router.post("/create-set", isLoggedIn, authorizedRoles("admin"), createMCQSet);
router.put("/update-set/:id", isLoggedIn, authorizedRoles("admin"), updateMCQSet);
router.delete("/delete-set/:id", isLoggedIn, authorizedRoles("admin"), deleteMCQSet);

router.get("/question/:index", isLoggedIn, getQuestionByIndex);
router.post("/submit-answer", isLoggedIn, submitAnswer);
router.get("/leaderboard", isLoggedIn, getLeaderboard);


export default router