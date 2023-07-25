/* eslint-disable spaced-comment */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import api, { ILoginData, INewUser, INewUserData } from '../../Api/Api';

import { RootState } from './store';

interface IUser {
    email: string;
    username: string;
    image: string;
}

interface IErrors {
    email?: string;
    username?: string;
    image?: string;
}

export interface IAccountState {
    user: IUser;
    isLogin: boolean;
    isLoading: boolean;
    isCurentUserLoading: boolean;
    isEditUserSuccess: boolean;
    errors: null | IErrors | unknown;
}

export const createAccount = createAsyncThunk(
    'account/createAccount',
    async (newUser: INewUser, { rejectWithValue }) => {
        try {
            const data = await api.createNewUserAccount(newUser);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const loginAccount = createAsyncThunk(
    'account/loginAccount',
    async (loginData: ILoginData, { rejectWithValue }) => {
        try {
            const data = await api.login(loginData);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const logout = createAsyncThunk('account/logout', () => {
    api.logOut();
    return true;
});

export const getCurrentUser = createAsyncThunk('account/getCurrentUser', async (_, { rejectWithValue }) => {
    try {
        const data = await api.getCurrentUser();
        return data;
    } catch (error) {
        return rejectWithValue(`${error}`);
    }
});

export const editAccount = createAsyncThunk(
    'account/editAccount',
    async (newUserData: INewUserData, { rejectWithValue }) => {
        try {
            const data = await api.editUserAccount(newUserData);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState: IAccountState = {
    user: {
        username: '',
        email: '',
        image: '',
    },
    isLogin: false,
    isLoading: false,
    isEditUserSuccess: false,
    isCurentUserLoading: true,
    errors: null,
};

export const userSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        clearServerErrors: (state) => {
            state.errors = null;
        },
        clearIsEditUserSuccess: (state) => {
            state.isEditUserSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createAccount.pending, (state) => {
            state.errors = null;
            state.isLoading = true;
        });
        builder.addCase(createAccount.fulfilled, (state, action) => {
            const { username, email, image: img } = action.payload.user;
            state.user = {
                username,
                email,
                image: img || '',
            };
            state.isLoading = false;
            state.isLogin = true;
        });
        builder.addCase(createAccount.rejected, (state, { payload }) => {
            state.errors = payload;
            state.isLoading = false;
        });

        builder.addCase(editAccount.pending, (state) => {
            state.errors = null;
            state.isLoading = true;
            state.isEditUserSuccess = false;
        });
        builder.addCase(editAccount.fulfilled, (state, action) => {
            const { username, email, image: img } = action.payload.user;
            state.user = {
                username,
                email,
                image: img || '',
            };
            state.isLoading = false;
            state.isLogin = true;
            state.isEditUserSuccess = true;
        });
        builder.addCase(editAccount.rejected, (state, { payload }) => {
            state.errors = payload;
            state.isLoading = false;
            state.isEditUserSuccess = false;
        });

        builder.addCase(loginAccount.pending, (state) => {
            state.errors = null;
            state.isLoading = true;
        });
        builder.addCase(loginAccount.fulfilled, (state, action) => {
            const { username, email, image: img } = action.payload.user;
            state.user = {
                username,
                email,
                image: img || '',
            };
            state.isLoading = false;
            state.isLogin = true;
        });
        builder.addCase(loginAccount.rejected, (state, { payload }) => {
            state.errors = payload;
            state.isLoading = false;
        });

        builder.addCase(logout.fulfilled, (state) => {
            state.isLogin = false;
            state.user = {
                username: '',
                email: '',
                image: '',
            };
        });

        builder.addCase(getCurrentUser.pending, (state) => {
            state.isCurentUserLoading = true;
        });
        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            const { username, email, image: img } = action.payload.user;
            state.user = {
                username,
                email,
                image: img || '',
            };
            state.isCurentUserLoading = false;
            state.isLogin = true;
        });
        builder.addCase(getCurrentUser.rejected, (state) => {
            state.isCurentUserLoading = false;
        });
    },
});
/*
,
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },*/

export const { clearServerErrors, clearIsEditUserSuccess } = userSlice.actions;

export const selectServerErrors = (state: RootState) => state.account.errors;
export const selectIsLoading = (state: RootState) => state.account.isLoading;
export const selectUser = (state: RootState) => state.account.user;
export const selectIsLogin = (state: RootState) => state.account.isLogin;
export const selectIsCurentUserLoading = (state: RootState) => state.account.isCurentUserLoading;
export const selectIsEditUserSuccess = (state: RootState) => state.account.isEditUserSuccess;

export default userSlice.reducer;
