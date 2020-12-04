import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the botEditorPage state domain
 */

const selectBotEditorPageDomain = state => state.botEditorPage || initialState;

/**
 * Other specific selectors
 */

const makeSelectModel = () =>
  createSelector(
    selectBotEditorPageDomain,
    substate => substate.model,
  );

const makeSelectChatHistory = () =>
  createSelector(
    selectBotEditorPageDomain,
    substate => substate.chatHistory,
  );

const makeSelectTransitionInProgress = () =>
  createSelector(
    selectBotEditorPageDomain,
    substate => substate.transitionInProgress,
  );

/**
 * Default selector used by BotEditorPage
 */

const makeSelectBotEditorPage = () =>
  createSelector(
    selectBotEditorPageDomain,
    substate => substate,
  );

export default makeSelectBotEditorPage;
export {
  selectBotEditorPageDomain,
  makeSelectModel,
  makeSelectChatHistory,
  makeSelectTransitionInProgress,
};
