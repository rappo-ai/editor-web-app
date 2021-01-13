/**
 * MessageListItem
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ListItem from 'components/ListItem';
import MessageBubble from 'components/MessageBubble';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: space-between;
`;

export function MessageListItem({ item, isLastItem }) {
  const content = (
    <Wrapper>
      <MessageBubble
        text={item.text}
        responses={item.responses}
        user={item.user}
        transitionEvent={item.transitionEvent}
        isLastItem={isLastItem}
        detachClick={item.detachClick}
        responseClick={item.responseClick}
        replyClick={item.replyClick}
      />
    </Wrapper>
  );

  // Render the content into a list item
  return (
    <ListItem
      key={`message-list-item-${item.id}`}
      item={content}
      scrollOnMount
    />
  );
}

MessageListItem.propTypes = {
  item: PropTypes.object,
  isLastItem: PropTypes.bool,
};

export default MessageListItem;
