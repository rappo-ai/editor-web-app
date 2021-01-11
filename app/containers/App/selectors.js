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

const makeSelectHeader = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.header,
  );

const makeSelectBots = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.bots,
  );

const makeSelectUser = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.user,
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
  makeSelectHeader,
  makeSelectBots,
  makeSelectUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocation,
};
