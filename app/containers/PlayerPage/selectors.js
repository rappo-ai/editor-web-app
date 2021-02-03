import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the playerPage state domain
 */

const selectPlayerPageDomain = state => state.playerPage || initialState;

/**
 * Other specific selectors
 */

const makeSelectBot = () =>
  createSelector(
    selectPlayerPageDomain,
    substate => substate.bot,
  );

const makeSelectBotUser = () =>
  createSelector(
    selectPlayerPageDomain,
    substate => substate.botUser,
  );

const makeSelectEndUser = () =>
  createSelector(
    selectPlayerPageDomain,
    substate => substate.endUser,
  );

const makeSelectChatHistory = () =>
  createSelector(
    selectPlayerPageDomain,
    substate => substate.chatHistory,
  );

const makeSelectModel = () =>
  createSelector(
    selectPlayerPageDomain,
    substate => substate.model,
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
  makeSelectBot,
  makeSelectBotUser,
  makeSelectEndUser,
  makeSelectChatHistory,
  makeSelectModel,
  makeSelectTransitionInProgress,
  selectPlayerPageDomain,
};
