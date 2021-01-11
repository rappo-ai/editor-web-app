import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the waitlistPage state domain
 */

const selectWaitlistPageDomain = state => state.waitlistPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by WaitlistPage
 */

const makeSelectWaitlistPage = () =>
  createSelector(
    selectWaitlistPageDomain,
    substate => substate,
  );

export default makeSelectWaitlistPage;
export { selectWaitlistPageDomain };
