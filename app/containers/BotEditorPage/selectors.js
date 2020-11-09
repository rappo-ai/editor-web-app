import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the botEditorPage state domain
 */

const selectBotEditorPageDomain = state => state.botEditorPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by BotEditorPage
 */

const makeSelectBotEditorPage = () =>
  createSelector(
    selectBotEditorPageDomain,
    substate => substate,
  );

export default makeSelectBotEditorPage;
export { selectBotEditorPageDomain };
