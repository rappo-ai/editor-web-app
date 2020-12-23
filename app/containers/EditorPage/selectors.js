import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editorPage state domain
 */

const selectEditorPageDomain = state => state.editorPage || initialState;

/**
 * Other specific selectors
 */

const makeSelectModel = () =>
  createSelector(
    selectEditorPageDomain,
    substate => substate.model,
  );

const makeSelectChatHistory = () =>
  createSelector(
    selectEditorPageDomain,
    substate => substate.chatHistory,
  );

const makeSelectTransitionInProgress = () =>
  createSelector(
    selectEditorPageDomain,
    substate => substate.transitionInProgress,
  );

/**
 * Default selector used by EditorPage
 */

const makeSelectEditorPage = () =>
  createSelector(
    selectEditorPageDomain,
    substate => substate,
  );

export default makeSelectEditorPage;
export {
  selectEditorPageDomain,
  makeSelectModel,
  makeSelectChatHistory,
  makeSelectTransitionInProgress,
};
