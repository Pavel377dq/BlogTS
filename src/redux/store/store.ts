import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import articleListReducer from './articleListSlice';
import articleSliceReducer from './articleSlice';
import userSliceReducer from './userSlice';

export const store = configureStore({
    reducer: {
        articleList: articleListReducer,
        article: articleSliceReducer,
        account: userSliceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
