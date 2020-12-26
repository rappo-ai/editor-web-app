/**
 *
 * ChatInputBar
 *
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ActionButtonBar from 'components/ActionButtonBar';
import { FAButton } from 'components/common';

import { INPUT_ACTION_BUTTON_ICON_COLOR } from 'utils/constants';

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

function getActionButton(type) {
  const button = {
    color: INPUT_ACTION_BUTTON_ICON_COLOR,
  };
  switch (type) {
    case 'response':
      button.faClass = 'fa-plus';
      break;
    default:
      break;
  }
  return button;
}

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
  onInputClick,
  onResponseMenuButtonClick,
}) {
  const inputBar = useRef(null);
  useEffect(() => {
    if (!disabled && inputBar && inputBar.current) {
      inputBar.current.focus();
    }
  }, [inputText, disabled]);

  const actionButtons = [];
  if (onResponseMenuButtonClick) {
    const responseButton = getActionButton('response');
    responseButton.click = onResponseMenuButtonClick;
    actionButtons.push(responseButton);
  }

  return (
    <Container>
      <ActionButtonBar disabled={disabled} buttons={actionButtons} />
      <InputBar
        ref={inputBar}
        type="text"
        value={inputText}
        disabled={disabled}
        onChange={e => onTyping && onTyping(e.target.value)}
        onKeyDown={e => onKeyDown && onKeyDown(e)}
        onBlur={e => onFocusOut && onFocusOut(e)}
        onClick={() => onInputClick && onInputClick()}
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
  onInputClick: PropTypes.func,
  onResponseMenuButtonClick: PropTypes.func,
};

export default ChatInputBar;
