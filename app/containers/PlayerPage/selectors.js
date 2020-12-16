import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the playerPage state domain
 */

const selectPlayerPageDomain = state => state.playerPage || initialState;

/**
 * Other specific selectors
 */

const makeSelectModel = () =>
  createSelector(
    selectPlayerPageDomain,
    substate => substate.model,
  );

const makeSelectChatHistory = () =>
  createSelector(
    selectPlayerPageDomain,
    substate => substate.chatHistory,
  );

const makeSelectTransitionInProgress = () =>
  createSelector(
    selectPlayerPageDomain,
    substate => substate.transitionInProgress,
  );

/**
 * Default selector used by PlayerPage
 */

const makeSelectPlayerPage = () =>
  createSelector(
    selectPlayerPageDomain,
    substate => substate,
  );

export default makeSelectPlayerPage;
export {
  selectPlayerPageDomain,
  makeSelectModel,
  makeSelectChatHistory,
  makeSelectTransitionInProgress,
};
