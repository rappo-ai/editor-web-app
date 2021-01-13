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

import {
  INPUT_ACTION_BUTTON_ICON_COLOR,
  BOT_MESSAGE_BUBBLE_BACKGROUND_COLOR,
} from 'utils/constants';

const BACKGROUND_COLOR = '#f0f0f0';

const Container = styled.div`
  border: 1px lightgray solid;
  background: ${BACKGROUND_COLOR};
  display: flex;
  flex-direction: column;
`;
const ReplyTextContainer = styled.div`
  display: flex;
  align-items: center;
`;
const ReplyTextBar = styled.div`
  min-width: 6px;
  width: 6px;
  height: 100%;
  background: ${BOT_MESSAGE_BUBBLE_BACKGROUND_COLOR};
`;
const ReplyText = styled.p`
  margin: 8px;
  width: 100%;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const ReplyCancelButton = styled(FAButton)`
  margin-right: 8px;
`;

const InputBarContainer = styled.div`
  padding: 2px;
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
  replyText,
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
  onReplyCancelClick,
}) {
  const inputBarRef = useRef(null);
  useEffect(() => {
    if (!disabled && inputBarRef && inputBarRef.current) {
      inputBarRef.current.focus();
    }
  }, [inputText, replyText, disabled]);

  const actionButtons = [];
  if (onResponseMenuButtonClick) {
    const responseButton = getActionButton('response');
    responseButton.click = onResponseMenuButtonClick;
    actionButtons.push(responseButton);
  }

  return (
    <Container>
      {replyText && (
        <ReplyTextContainer>
          <ReplyTextBar />
          <ReplyText>{replyText}</ReplyText>
          <ReplyCancelButton
            backgroundColor="#cccccc"
            iconColor="white"
            iconClass="fa-times"
            iconSize="12px"
            width="16px"
            height="16px"
            onClick={onReplyCancelClick}
          />
        </ReplyTextContainer>
      )}
      <InputBarContainer>
        <ActionButtonBar disabled={disabled} buttons={actionButtons} />
        <InputBar
          ref={inputBarRef}
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
      </InputBarContainer>
    </Container>
  );
}

ChatInputBar.propTypes = {
  inputText: PropTypes.string,
  replyText: PropTypes.string,
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
  onReplyCancelClick: PropTypes.func,
};

export default ChatInputBar;
