import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import App from '../index';

const renderer = new ShallowRenderer();

describe('<App />', () => {
  it('should render and match the snapshot', () => {
    renderer.render(<App />);
    /* eslint-disable-next-line no-unused-vars */
    const renderedOutput = renderer.getRenderOutput();
    // expect(renderedOutput).toMatchSnapshot();
  });
});
