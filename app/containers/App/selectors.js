/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = state => state.global || initialState;

const selectRouter = state => state.router;

const makeSelectCookies = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.cookies,
  );

const makeSelectSession = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.session,
  );

const makeSelectUserProfile = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.user.profile,
  );

const makeSelectLoading = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.error,
  );

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState.location,
  );

export {
  selectGlobal,
  makeSelectCookies,
  makeSelectSession,
  makeSelectUserProfile,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocation,
};
