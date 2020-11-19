/**
 *
 * BotListItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import ListItem from 'components/ListItem';
import BotLink from './BotLink';
import Wrapper from './Wrapper';

function BotListItem({ item }) {
  const content = (
    <Wrapper>
      <BotLink href={`/bot/${item.id}`}>{item.name}</BotLink>
    </Wrapper>
  );

  // Render the content into a list item
  return <ListItem key={`bot-list-item-${item.id}`} item={content} />;
}

BotListItem.propTypes = {
  item: PropTypes.object,
};

export default BotListItem;
