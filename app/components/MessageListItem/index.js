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

export function MessageListItem({ item }) {
  // Put together the content of the repository
  const content = (
    <Wrapper>
      <MessageBubble
        text={item.text}
        responses={item.responses}
        user={item.user}
        detachClick={item.detachClick}
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
};

export default MessageListItem;
