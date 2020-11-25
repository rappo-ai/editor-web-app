/**
 * BotListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import PropTypes from 'prop-types';

import ListItem from 'components/ListItem';
import MessageBubble from 'components/MessageBubble';
import Wrapper from './Wrapper';

export function MessageListItem({ item }) {
  // Put together the content of the repository
  const content = (
    <Wrapper>
      <MessageBubble text={item.text} user={item.user} />
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
