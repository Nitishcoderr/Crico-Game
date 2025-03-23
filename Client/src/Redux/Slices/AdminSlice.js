import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from '../../Helpers/axiosInstance';

const initialState = {
    totalUsers: 0,
    userActivity: [],
    loading: false,
    error: null
};

// Get total users count
export const getTotalUsers = createAsyncThunk('admin/getTotalUsers', async () => {
    try {
        const response = await axiosInstance.get('admin/total-users');
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

// Get user activity data
export const getUserActivity = createAsyncThunk('admin/getUserActivity', async (timeFilter = 'daily') => {
    try {
        const response = await axiosInstance.get(`admin/user-activity?filter=${timeFilter}`);
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get total users
            .addCase(getTotalUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTotalUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.totalUsers = action.payload.totalUsers;
            })
            .addCase(getTotalUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Get user activity
            .addCase(getUserActivity.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.userActivity = action.payload.activity;
            })
            .addCase(getUserActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default adminSlice.reducer; 