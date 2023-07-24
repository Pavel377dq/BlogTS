/* eslint-disable spaced-comment */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import api from '../../Api/Api';

import { IArticle } from './articleSlice';
import { RootState } from './store';

export const fetchArticles = createAsyncThunk('articleList/fetchArticles', async (page:number, { rejectWithValue }) => {
    try {
        const data = await api.getArticles((page - 1) * 20);
        return data;
    } catch (error) {
        return rejectWithValue(`${error}`);
    }
});


export interface IArticleListState {
    articlesCount: number;
    currentPage: number;
    isLoading: boolean;
    error: null | string;
    status: null| string
  }

export const articlesAdapter = createEntityAdapter<IArticle>({
    selectId: (article) => article.slug,
});

const initialState = articlesAdapter.getInitialState<IArticleListState>({
    articlesCount: 0,
    currentPage: 1,
    status: null,
    error: null,
    isLoading: false
});

export const articleListSlice = createSlice({
    name: 'articleList',
    initialState,
    reducers: {
        updateOneFavorited: articlesAdapter.updateOne,

        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchArticles.pending, (state) => {
            state.status = 'pending';
        });
        builder.addCase(fetchArticles.fulfilled, (state, action) => {
            articlesAdapter.setAll(state, action.payload.articles);
            state.articlesCount = action.payload.articlesCount;
            state.status = 'fulfilled';
        });
        builder.addCase(fetchArticles.rejected, (state, action) => {
            state.error = `${action.payload}`;
            state.status = 'rejected';
        });
    },
});

export const { selectAll: selectAllArticles } = articlesAdapter.getSelectors<RootState>((state) => state.articleList);
export const selectArticlesCount = (state: RootState) => state.articleList.articlesCount;
export const selectStatus = (state: RootState) => state.articleList.status;
export const selectError = (state: RootState) => state.articleList.error;
export const selectCurrentPage = (state: RootState) => state.articleList.currentPage;

export const { setCurrentPage, updateOneFavorited } = articleListSlice.actions;

export default articleListSlice.reducer;
