/**
 *
 * Asynchronously loads the component for EditorPage
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
