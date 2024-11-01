import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../services/apiSlice';
import insuranceApplicationReducer from '../insuranceApplication/insuranceApplicationSlice'; // Import the insurance application slice

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        insuranceApplication: insuranceApplicationReducer, // Use the insurance application slice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
