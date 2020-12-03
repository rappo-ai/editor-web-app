/**
 *
 * ChatInputBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2px;
  border: 1px lightgray solid;
  background: #f0f0f0;
  display: flex;
  align-items: center;
`;
const InputBar = styled.input`
  flex-grow: 1;
  margin-right: 2px;
  height: 36px;
  border: 1px lightgray solid;
`;

const SendButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: ${props => props.color};
  border-radius: 50%;
  cursor: pointer;
`;

const SendButton = styled.i`
  color: ${props => props.color};
  vertical-align: middle;
`;

function ChatInputBar({
  inputText,
  disabled,
  sendButtonColor,
  sendButtonIconColor,
  sendButtonIconClass,
  onTyping,
  onKeyDown,
  onSendClick,
}) {
  return (
    <Container>
      <InputBar
        type="text"
        value={inputText}
        disabled={disabled}
        onChange={e => onTyping(e.target.value)}
        onKeyDown={e => onKeyDown(e)}
      />
      <SendButtonContainer
        disabled={disabled}
        onClick={onSendClick}
        color={sendButtonColor}
      >
        <SendButton
          className={`fa fa-1x ${sendButtonIconClass}`}
          color={sendButtonIconColor}
        />
      </SendButtonContainer>
    </Container>
  );
}

ChatInputBar.propTypes = {
  inputText: PropTypes.string,
  disabled: PropTypes.bool,
  sendButtonColor: PropTypes.string,
  sendButtonIconColor: PropTypes.string,
  sendButtonIconClass: PropTypes.string,
  onTyping: PropTypes.func,
  onKeyDown: PropTypes.func,
  onSendClick: PropTypes.func,
};

export default ChatInputBar;
