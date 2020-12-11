/**
 *
 * ChatInputBar
 *
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FAButton } from 'components/common';

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

const SendButton = styled(FAButton)``;

function ChatInputBar({
  inputText,
  disabled,
  sendButtonColor,
  sendButtonIconColor,
  sendButtonIconClass,
  onTyping,
  onKeyDown,
  onSendClick,
  onFocusOut,
}) {
  const inputBar = useRef(null);
  useEffect(() => {
    if (!disabled && inputBar && inputBar.current) {
      inputBar.current.focus();
    }
  }, [inputText, disabled]);

  return (
    <Container>
      <InputBar
        ref={inputBar}
        type="text"
        value={inputText}
        disabled={disabled}
        onChange={e => onTyping(e.target.value)}
        onKeyDown={e => onKeyDown(e)}
        onBlur={e => onFocusOut(e)}
      />
      <SendButton
        disabled={disabled}
        onClick={onSendClick}
        backgroundColor={sendButtonColor}
        iconColor={sendButtonIconColor}
        iconClass={sendButtonIconClass}
        width="36px"
        height="36px"
      />
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
  onFocusOut: PropTypes.func,
};

export default ChatInputBar;
