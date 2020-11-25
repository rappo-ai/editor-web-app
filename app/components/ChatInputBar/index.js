/**
 *
 * ChatInputBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  height: 40px;
  padding: 2px;
  border: 1px gray solid;
  background: lightgray;
  display: flex;
`;
const InputBar = styled.input`
  flex-grow: 1;
  margin-right: 2px;
`;

const SendButton = styled.button``;

function ChatInputBar({ inputText, onTyping, onSendClick }) {
  return (
    <Container>
      <InputBar
        type="text"
        value={inputText}
        onChange={e => onTyping(e.target.value)}
      />
      <SendButton onClick={onSendClick}>Send</SendButton>
    </Container>
  );
}

ChatInputBar.propTypes = {
  inputText: PropTypes.string,
  onTyping: PropTypes.func,
  onSendClick: PropTypes.func,
};

export default ChatInputBar;
