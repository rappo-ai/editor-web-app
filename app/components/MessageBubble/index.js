/**
 *
 * MessageBubble
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
  align-items: ${({ user }) => (user === 'bot' ? 'flex-start' : 'flex-end')};
`;
const Bubble = styled.p`
  white-space: pre-wrap;
  max-width: 80%;
  margin: 8px 0;
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
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(53, 53, 53, 0.5);
  color: ${BOT_QUICK_RESPONSE_FONT_COLOR};
  background: ${BOT_QUICK_RESPONSE_BACKGROUND_COLOR};
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 0.85rem;
`;
function MessageBubble({ text, responses, user }) {
  return (
    <Container user={user}>
      <Bubble user={user}>{text}</Bubble>
      <ResponseContainer>
        {responses.map(response => (
          <Response key={response}>{response}</Response>
        ))}
      </ResponseContainer>
    </Container>
  );
}

MessageBubble.propTypes = {
  text: PropTypes.string,
  responses: PropTypes.array,
  user: PropTypes.string,
};

export default MessageBubble;
