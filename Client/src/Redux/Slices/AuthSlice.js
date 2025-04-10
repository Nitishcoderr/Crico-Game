import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from '../../Helpers/axiosInstance';

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') || false,
  data: JSON.parse(localStorage.getItem('data')) || {},
  role: localStorage.getItem('role') || '',
};

export const createAccount = createAsyncThunk('/auth/signup', async (data) => {
  try {
    const res = axiosInstance.post('user/register', data);
    toast.promise(res, {
      loading: 'Wait! creating your account',
      success: (data) => {
        return data?.data?.message;
      },
      error: 'Failed to create account',
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const login = createAsyncThunk('/auth/login', async (data) => {
  try {
    const res = axiosInstance.post('user/login', data);
    toast.promise(res, {
      loading: 'Wait! authentication in progress...',
      success: (data) => {
        return data?.data?.message;
      },
      error: 'Failed to login',
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const logout = createAsyncThunk('/auth/logout', async () => {
  try {
    const res = axiosInstance.get('user/logout');
    toast.promise(res, {
      loading: 'Wait! logout in progress...',
      success: (data) => {
        return data?.data?.message;
      },
      error: 'Failed to logout',
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// Update profile
export const updateProfile = createAsyncThunk('/user/update/profile', async (data) => {
  try {
    const res = axiosInstance.put(`user/update/${data.id}`, data);
    toast.promise(res, {
      loading: 'Wait! profile update in progress...',
      success: (data) => {
        return data?.data?.message;
      },
      error: 'Failed to update profile',
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// GET USER
export const getUserData = createAsyncThunk('/user/details', async () => {
  try {
    const res = await axiosInstance.get('/user/me');
    const userData = (await res).data;
    return userData;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem('data', JSON.stringify(action?.payload?.user));
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('role', action?.payload?.user?.role);
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.data = {};
        state.isLoggedIn = false;
        state.role = '';
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        const { user } = action.payload;

        localStorage.setItem('data', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('role', user?.role);

        // Update subscription status in state
        state.subscriptionStatus = user?.subscription?.status || '';

        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role;
      });
  },
});

export default authSlice.reducer;
