/**
 * Test the repo list item
 */

import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';

import { MessageListItem } from '../index';

const renderComponent = (props = {}) =>
  render(
    <IntlProvider locale="en">
      <MessageListItem {...props} />
    </IntlProvider>,
  );

describe('<MessageListItem />', () => {
  expect(renderComponent);
});
