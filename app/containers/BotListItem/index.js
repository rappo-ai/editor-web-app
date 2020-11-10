/**
 * BotListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import PropTypes from 'prop-types';

import ListItem from 'components/ListItem';
import BotLink from './BotLink';
import Wrapper from './Wrapper';

export function BotListItem({ item }) {
  // Put together the content of the repository
  const content = (
    <Wrapper>
      <BotLink href={`/bots/${item.id}`}>{item.name}</BotLink>
    </Wrapper>
  );

  // Render the content into a list item
  return <ListItem key={`bot-list-item-${item.id}`} item={content} />;
}

BotListItem.propTypes = {
  item: PropTypes.object,
};

export default BotListItem;
