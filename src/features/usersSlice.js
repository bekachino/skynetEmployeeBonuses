import { createSlice } from '@reduxjs/toolkit';
import { fetchLocations, signIn, signUp } from './userThunk';

const initialState = {
  user: '',
  signInLoading: false,
  signUpLoading: false,
  authorizationError: '',
  authorizationMessage: '',
  popupId: '',
  locations: [],
  nonActive: null,
  lastViewedActiveLs: '',
};

const UsersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = '';
    },
    setPopupId: (state, action) => {
      state.popupId = action.payload;
    },
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    setNonActive: (state, action) => {
      state.nonActive = action.payload;
    },
    setLastViewedActiveLs: (state, action) => {
      state.lastViewedActiveLs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.pending, (state) => {
      state.user = '';
      state.authorizationError = '';
      state.authorizationMessage = '';
      state.signUpLoading = true;
    });
    builder.addCase(signUp.fulfilled, (state, { payload: res }) => {
      state.signUpLoading = false;
      state.user = res.token || '';
      state.authorizationMessage = res.message;
    });
    builder.addCase(signUp.rejected, (state, { payload: error }) => {
      state.signUpLoading = false;
      state.authorizationError =
        error?.error || 'Произошла ошибка. Попробуйте позже';
    });

    builder.addCase(signIn.pending, (state) => {
      state.user = '';
      state.authorizationError = '';
      state.authorizationMessage = '';
      state.signInLoading = true;
    });
    builder.addCase(signIn.fulfilled, (state, { payload: res }) => {
      state.signInLoading = false;
      state.user = res?.token || '' || res;
      state.authorizationMessage = res.message;
    });
    builder.addCase(signIn.rejected, (state, { payload: error }) => {
      state.signInLoading = false;
      state.authorizationError =
        error?.error || 'Произошла ошибка. Попробуйте позже';
    });

    builder.addCase(fetchLocations.pending, (state) => {
      state.locations = [];
    });
    builder.addCase(fetchLocations.fulfilled, (state, { payload: res }) => {
      state.locations = res.data;
    });
    builder.addCase(fetchLocations.rejected, (state, { payload: _ }) => {
      state.locations = [];
    });
  },
});

export const userReducer = UsersSlice.reducer;
export const {
  logout,
  setPopupId,
  setLocations,
  setNonActive,
  setLastViewedActiveLs,
} = UsersSlice.actions;
