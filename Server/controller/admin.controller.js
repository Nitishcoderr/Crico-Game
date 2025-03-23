import User from "../models/user.modal.js";
import AppError from "../utils/error.utils.js";

// Get total users count
const getTotalUsers = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            message: "Total users count fetched successfully",
            totalUsers
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

// Get user activity data
const getUserActivity = async (req, res, next) => {
    try {
        const { filter = 'daily' } = req.query;
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Set to end of day
        let startDate;
        let endDate;
        let dateFormat;
        let intervals;

        // Set the date range and intervals based on filter
        switch (filter) {
            case 'yearly':
                // Start from January of current year
                startDate = new Date(today.getFullYear(), 0, 1);
                dateFormat = '%Y-%m';
                intervals = 12; // Show all 12 months
                break;
            case 'weekly':
                // Calculate dates for last 7 days including today
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 6);
                startDate.setHours(0, 0, 0, 0); // Start of day
                dateFormat = '%Y-%m-%d';
                intervals = 7;
                break;
            case 'monthly':
                // Start from 1st of current month
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                startDate.setHours(0, 0, 0, 0);
                // Calculate last day of current month
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                dateFormat = '%Y-%m-%d';
                intervals = endDate.getDate(); // Get the last day of month
                break;
            default: // daily
                startDate = new Date(today);
                startDate.setHours(0, 0, 0, 0); // Start of today
                dateFormat = '%Y-%m-%d %H:00';
                intervals = 24;
        }

        // Generate all possible time slots
        const timeSlots = [];
        for (let i = 0; i < intervals; i++) {
            const date = new Date(startDate);
            if (filter === 'daily') {
                date.setHours(date.getHours() + i);
            } else if (filter === 'yearly') {
                date.setMonth(date.getMonth() + i);
            } else if (filter === 'weekly') {
                date.setDate(date.getDate() + i);
            } else if (filter === 'monthly') {
                date.setDate(1 + i); // Start from day 1 and increment
            }

            let slotDate;
            if (filter === 'daily') {
                slotDate = date.toISOString().slice(0, 13) + ':00';
            } else if (filter === 'yearly') {
                slotDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            } else {
                slotDate = date.toISOString().slice(0, 10);
            }

            // For yearly view and future dates in monthly view, handle appropriately
            if ((filter === 'yearly' && date > today) ||
                (filter === 'monthly' && date > today)) {
                timeSlots.push({
                    date: slotDate,
                    newUsers: 0,
                    totalUsers: 0
                });
            } else {
                timeSlots.push({
                    date: slotDate,
                    newUsers: 0,
                    totalUsers: 0
                });
            }
        }

        // Get new users per time period
        const newUsersData = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: filter === 'monthly' ? endDate : today
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: dateFormat,
                            date: '$createdAt',
                            timezone: 'UTC'
                        }
                    },
                    newUsers: { $sum: 1 }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ]);

        // Get initial total users before start date
        let runningTotal = await User.countDocuments({
            createdAt: { $lt: startDate }
        });

        // Merge actual data with time slots
        const activity = timeSlots.map((slot, index) => {
            const actualData = newUsersData.find(data => data._id === slot.date);
            const newUsers = actualData ? actualData.newUsers : 0;
            const slotDate = new Date(slot.date);

            // For yearly view and future dates in monthly view, maintain the last known total
            if ((filter === 'yearly' && slotDate > today) ||
                (filter === 'monthly' && slotDate > today)) {
                return {
                    date: slot.date,
                    newUsers: 0,
                    totalUsers: runningTotal
                };
            }

            runningTotal += newUsers;
            return {
                date: slot.date,
                newUsers: newUsers,
                totalUsers: runningTotal
            };
        });

        res.status(200).json({
            success: true,
            message: "User activity data fetched successfully",
            activity
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

export {
    getTotalUsers,
    getUserActivity
}; 