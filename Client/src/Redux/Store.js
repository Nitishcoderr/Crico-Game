import { configureStore } from '@reduxjs/toolkit'
import AuthSliceReducer from './Slices/AuthSlice';
import McqSliceReducer from './Slices/McqSlice';
import AdminSliceReducer from './Slices/AdminSlice';

const store = configureStore({
    reducer: {
        auth: AuthSliceReducer,
        mcq: McqSliceReducer,
        admin: AdminSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
    devTools: true
})

export default store;