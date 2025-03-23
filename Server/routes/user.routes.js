import { Router } from "express";
import { getProfile, login, logout, register, updateUser } from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
const router = Router()



router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/me', isLoggedIn, getProfile)
router.put('/update/:id', isLoggedIn, updateUser)



export default router