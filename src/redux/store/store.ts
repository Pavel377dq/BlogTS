import { configureStore } from '@reduxjs/toolkit';

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


