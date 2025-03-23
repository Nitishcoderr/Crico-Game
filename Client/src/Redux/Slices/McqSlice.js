import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from '../../Helpers/axiosInstance';

const initialState = {
    mcqSets: [],
    currentQuestion: null,
    currentIndex: 0,
    totalQuestions: 0,
    isGameComplete: false,
    timeTaken: 0,
    loading: false,
    error: null,
    currentMcqSetId: null,
    totalScore: 0,
    leaderboard: []
};

// Get all MCQ sets
export const getAllMcqs = createAsyncThunk('mcq/getAllMcqs', async () => {
    try {
        const response = await axiosInstance.get('mcq/all');
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

// Get question by index
export const getQuestionByIndex = createAsyncThunk('mcq/getQuestionByIndex',
    async ({ index, mcqSetId }) => {
        try {
            const response = await axiosInstance.get(`mcq/question/${index}?mcqSetId=${mcqSetId}`);
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message);
            throw error;
        }
    }
);

// Submit answer
export const submitAnswer = createAsyncThunk('mcq/submitAnswer',
    async ({ index, selectedAnswer, timeTaken, mcqSetId }) => {
        try {
            const response = await axiosInstance.post('mcq/submit-answer', {
                index,
                selectedAnswer,
                timeTaken,
                mcqSetId
            });

            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message);
            throw error;
        }
    }
);

// Get leaderboard
export const getLeaderboard = createAsyncThunk('mcq/getLeaderboard', async () => {
    try {
        const response = await axiosInstance.get('mcq/leaderboard');
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

// Create MCQ set
export const createMcqSet = createAsyncThunk('mcq/createMcqSet', async (payload) => {
    try {
        const response = await axiosInstance.post('mcq/create-set', payload);
        toast.success('MCQ set created successfully');
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

// Update MCQ set
export const updateMcqSet = createAsyncThunk('mcq/updateMcqSet', async ({ id, payload }) => {
    try {
        const response = await axiosInstance.put(`mcq/update-set/${id}`, payload);
        toast.success('MCQ set updated successfully');
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

// Delete MCQ set
export const deleteMcqSet = createAsyncThunk('mcq/deleteMcqSet', async (id) => {
    try {
        const response = await axiosInstance.delete(`mcq/delete-set/${id}`);
        toast.success('MCQ set deleted successfully');
        return { id, ...response.data };
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

const mcqSlice = createSlice({
    name: 'mcq',
    initialState,
    reducers: {
        updateTimeTaken: (state, action) => {
            state.timeTaken = action.payload;
        },
        resetGame: (state) => {
            return {
                ...initialState,
                mcqSets: state.mcqSets // Preserve mcqSets when resetting
            };
        },
        setCurrentMcqSetId: (state, action) => {
            state.currentMcqSetId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get all MCQs
            .addCase(getAllMcqs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllMcqs.fulfilled, (state, action) => {
                state.loading = false;
                state.mcqSets = action.payload.mcqSets;
            })
            .addCase(getAllMcqs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Get question by index
            .addCase(getQuestionByIndex.pending, (state) => {
                state.loading = true;
            })
            .addCase(getQuestionByIndex.fulfilled, (state, action) => {
                state.loading = false;
                state.currentQuestion = action.payload.question;
                state.currentIndex = action.payload.currentIndex;
                state.totalQuestions = action.payload.totalQuestions;
                state.isGameComplete = false; // Ensure game is not marked as complete when getting a question
            })
            .addCase(getQuestionByIndex.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Submit answer
            .addCase(submitAnswer.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitAnswer.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.completed) {
                    state.isGameComplete = true;
                    state.totalScore = action.payload.totalScore;
                    toast.success(action.payload.message);
                } else {
                    state.currentIndex = action.payload.nextIndex;
                    toast.success('Correct answer! Moving to next question.');
                }
            })
            .addCase(submitAnswer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create MCQ set
            .addCase(createMcqSet.pending, (state) => {
                state.loading = true;
            })
            .addCase(createMcqSet.fulfilled, (state, action) => {
                state.loading = false;
                state.mcqSets = [...state.mcqSets, action.payload.mcqSet];
            })
            .addCase(createMcqSet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update MCQ set
            .addCase(updateMcqSet.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateMcqSet.fulfilled, (state, action) => {
                state.loading = false;
                state.mcqSets = state.mcqSets.map((mcqSet) =>
                    mcqSet._id === action.payload.mcqSet._id ? action.payload.mcqSet : mcqSet
                );
            })
            .addCase(updateMcqSet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete MCQ set
            .addCase(deleteMcqSet.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteMcqSet.fulfilled, (state, action) => {
                state.loading = false;
                state.mcqSets = state.mcqSets.filter((mcqSet) => mcqSet._id !== action.payload.id);
            })
            .addCase(deleteMcqSet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Get leaderboard
            .addCase(getLeaderboard.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLeaderboard.fulfilled, (state, action) => {
                state.loading = false;
                state.leaderboard = action.payload.leaderboard;
            })
            .addCase(getLeaderboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { updateTimeTaken, resetGame, setCurrentMcqSetId } = mcqSlice.actions;
export default mcqSlice.reducer;
