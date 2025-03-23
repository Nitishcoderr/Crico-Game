import { Router } from 'express';
import { getTotalUsers, getUserActivity } from '../controller/admin.controller.js';
import { isLoggedIn, authorizedRoles } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all routes after this middleware - only for logged in users
router.use(isLoggedIn);
router.use(authorizedRoles('admin')); // Only admin can access these routes

router.route('/total-users').get(getTotalUsers);
router.route('/user-activity').get(getUserActivity);

export default router; 