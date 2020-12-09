/**
 *
 * ChatView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MessageList from 'components/MessageList';
import PopupList from 'components/PopupList';

const Container = styled.div`
  height: 100%;
  position: relative;
  overflow: auto;
`;

function ChatView({ loading, error, messages, popupListItems }) {
  return (
    <Container>
      <MessageList loading={loading} error={error} messages={messages} />
      {popupListItems.length > 0 && <PopupList items={popupListItems} />}
    </Container>
  );
}

ChatView.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  messages: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  popupListItems: PropTypes.array,
};

export default ChatView;
