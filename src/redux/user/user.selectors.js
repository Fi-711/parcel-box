import { createSelector } from 'reselect';

const selectUser = (state) => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser
);

export const selectName = createSelector([selectUser], (user) => user.name);

export const selectAccessToken = createSelector(
  [selectUser],
  (user) => user.accessToken
);
