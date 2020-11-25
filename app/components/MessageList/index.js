/**
 *
 * MessagesList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import MessageListItem from 'components/MessageListItem';

const StyledList = styled(List)`
  height: 100%;
`;

function MessageList({ loading, error, messages }) {
  if (loading) {
    return <StyledList component={LoadingIndicator} />;
  }

  if (error !== false) {
    const ErrorComponent = () => (
      <ListItem item="Something went wrong, please try again!" />
    );
    return <StyledList component={ErrorComponent} />;
  }

  if (messages !== false) {
    return <StyledList items={messages} component={MessageListItem} />;
  }

  return null;
}

MessageList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  messages: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
};

export default MessageList;
