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
  BOT_MESSAGE_BUBBLE_BACKGROUND_COLOR,
  BOT_MESSAGE_BUBBLE_FONT_COLOR,
  BOT_QUICK_RESPONSE_BACKGROUND_COLOR,
  BOT_QUICK_RESPONSE_FONT_COLOR,
  USER_MESSAGE_BUBBLE_BACKGROUND_COLOR,
  USER_MESSAGE_BUBBLE_FONT_COLOR,
} from 'utils/constants';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${({ user }) =>
    user === 'bot' || user === 'typing' ? 'flex-start' : 'flex-end'};
`;
const Bubble = styled.p`
  white-space: pre-wrap;
  max-width: 80%;
  margin: 2px 0;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(53, 53, 53, 0.5);
  color: ${({ user }) =>
    user === 'bot'
      ? BOT_MESSAGE_BUBBLE_FONT_COLOR
      : USER_MESSAGE_BUBBLE_FONT_COLOR};
  background: ${({ user }) =>
    user === 'bot'
      ? BOT_MESSAGE_BUBBLE_BACKGROUND_COLOR
      : USER_MESSAGE_BUBBLE_BACKGROUND_COLOR};
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 0.85rem;
`;
const ResponseContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
  background: ${BOT_QUICK_RESPONSE_BACKGROUND_COLOR};
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
  margin: 6px 0 0 2px;
`;

function MessageBubble({
  text,
  responses,
  user,
  detachClick,
  responseClick,
  isLastItem,
}) {
  return (
    <Container user={user}>
      {user === 'bot' && (
        <DetachButton
          backgroundColor="#cccccc"
          iconColor="white"
          iconClass="fa-cut fa-rotate-90"
          iconSize="8px"
          width="12px"
          height="12px"
          onClick={detachClick}
        />
      )}
      {user === 'typing' && <LoadingBubble />}
      {user !== 'typing' && <Bubble user={user}>{text}</Bubble>}
      <ResponseContainer>
        {responses.map(response => (
          <Response
            key={response}
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
  detachClick: PropTypes.func,
  responseClick: PropTypes.func,
  isLastItem: PropTypes.bool,
};

export default MessageBubble;
