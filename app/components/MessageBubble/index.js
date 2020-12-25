/**
 *
 * MessageBubble
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import { FAButton } from 'components/common';

import {
  getBubbleFontColor,
  getBubbleBackgroundColor,
  getBubbleText,
} from 'utils/bubble';
import {
  BOT_MESSAGE_BUBBLE_BACKGROUND_COLOR,
  BOT_QUICK_RESPONSE_BACKGROUND_COLOR,
  BOT_QUICK_RESPONSE_FONT_COLOR,
  BOT_QUICK_RESPONSE_SELECTED_BACKGROUND_COLOR,
} from 'utils/constants';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${({ user }) => {
    const map = {
      bot: 'flex-start',
      typing: 'flex-start',
      start: 'center',
      user: 'flex-end',
      end: 'center',
    };
    return map[user];
  }};
`;

const BubbleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: ${({ user }) => {
    const map = {
      bot: 'flex-start',
      typing: 'flex-start',
      start: 'center',
      user: 'flex-end',
      end: 'center',
    };
    return map[user];
  }};
`;

const Bubble = styled.p`
  white-space: pre-wrap;
  max-width: 80%;
  margin: 2px 0;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(53, 53, 53, 0.5);
  color: ${({ fontColor }) => fontColor};
  background: ${({ backgroundColor }) => backgroundColor};
  font-size: 0.85rem;
`;
const ResponseContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: ${props => (props.hasMargin ? '22px' : '0')};
`;
const Response = styled.p`
  max-width: 100%;
  padding: 8px;
  margin: 0;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 6px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(53, 53, 53, 0.5);
  color: ${BOT_QUICK_RESPONSE_FONT_COLOR};
  background: ${props =>
    props.selected
      ? BOT_QUICK_RESPONSE_SELECTED_BACKGROUND_COLOR
      : BOT_QUICK_RESPONSE_BACKGROUND_COLOR};
  font-size: 0.85rem;
  cursor: ${props => (props.isLastItem ? 'pointer' : 'not-allowed')};
  pointer-events: ${props => (props.isLastItem ? 'auto' : 'none')};
`;

const Ellipsis1Animation = keyframes`
  0% { transform: scale(0); }
  100% { transform: scale(1); }
`;

const Ellipsis2Animation = keyframes`
  0% { transform: translate(0, 0); }
  100% { transform: translate(12px, 0); }
`;

const Ellipsis3Animation = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(0); }
`;

const LoadingContainer = styled.div`
  position: relative;
  left: 4px;
  div {
    position: absolute;
    top: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${BOT_MESSAGE_BUBBLE_BACKGROUND_COLOR};
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  div:nth-child(1) {
    left: 0px;
    animation: ${Ellipsis1Animation} 0.6s infinite;
  }
  div:nth-child(2) {
    left: 0px;
    animation: ${Ellipsis2Animation} 0.6s infinite;
  }
  div:nth-child(3) {
    left: 12px;
    animation: ${Ellipsis2Animation} 0.6s infinite;
  }
  div:nth-child(4) {
    left: 24px;
    animation: ${Ellipsis3Animation} 0.6s infinite;
  }
`;

function LoadingBubble() {
  return (
    <LoadingContainer>
      <div />
      <div />
      <div />
      <div />
    </LoadingContainer>
  );
}

const DetachButton = styled(FAButton)`
  margin-right: 6px;
`;

function MessageBubble({
  text,
  responses,
  user,
  transitionEvent,
  isLastItem,
  detachClick,
  responseClick,
}) {
  return (
    <Container user={user}>
      {user === 'typing' && <LoadingBubble />}
      <BubbleContainer user={user}>
        {user === 'bot' && detachClick && (
          <DetachButton
            backgroundColor="#cccccc"
            iconColor="white"
            iconClass="fa-cut fa-rotate-90"
            iconSize="12px"
            width="16px"
            height="16px"
            onClick={detachClick}
          />
        )}
        {user !== 'typing' && (
          <Bubble
            fontColor={getBubbleFontColor(user)}
            backgroundColor={getBubbleBackgroundColor(
              user,
              transitionEvent && transitionEvent.type,
            )}
          >
            {getBubbleText(user, text, transitionEvent && transitionEvent.type)}
          </Bubble>
        )}
      </BubbleContainer>
      <ResponseContainer hasMargin={!!detachClick}>
        {responses &&
          responses.map(response => (
            <Response
              key={response}
              selected={
                transitionEvent &&
                transitionEvent.type === 'response' &&
                transitionEvent.value === response
              }
              isLastItem={isLastItem}
              onClick={() => responseClick(response)}
            >
              {response}
            </Response>
          ))}
      </ResponseContainer>
    </Container>
  );
}

MessageBubble.propTypes = {
  text: PropTypes.string,
  responses: PropTypes.array,
  user: PropTypes.string,
  transitionEvent: PropTypes.object,
  isLastItem: PropTypes.bool,
  detachClick: PropTypes.func,
  responseClick: PropTypes.func,
};

export default MessageBubble;
