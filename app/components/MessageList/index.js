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

function MessageList({ loading, error, messages }) {
  const ListContainer = styled(List)`
    display: flex;
  `;

  if (loading) {
    return <ListContainer component={LoadingIndicator} />;
  }

  if (error !== false) {
    const ErrorComponent = () => (
      <ListItem item="Something went wrong, please try again!" />
    );
    return <ListContainer component={ErrorComponent} />;
  }

  if (messages !== false) {
    return <ListContainer items={messages} component={MessageListItem} />;
  }

  return null;
}

MessageList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  messages: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
};

export default MessageList;
