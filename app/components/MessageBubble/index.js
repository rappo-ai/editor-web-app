/**
 *
 * MessageBubble
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PRIMARY_COLOR } from 'utils/constants';

function MessageBubble({ text, user }) {
  const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: ${user === 'bot' ? 'flex-start' : 'flex-end'};
    align-items: center;
  `;
  const Bubble = styled.p`
    max-width: 80%;
    padding: 10px;
    border-radius: 10px;
    color: white;
    background: ${user === 'bot' ? PRIMARY_COLOR : 'gray'};
  `;
  return (
    <Container>
      <Bubble>{text}</Bubble>
    </Container>
  );
}

MessageBubble.propTypes = {
  text: PropTypes.string,
  user: PropTypes.string,
};

export default MessageBubble;
