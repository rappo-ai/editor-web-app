/**
 *
 * BotListItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { CircleImage as Avatar } from 'components/common';
import ListItem from 'components/ListItem';
import { PRIMARY_COLOR } from 'utils/constants';
import history from 'utils/history';
import BotLink from './BotLink';
import Wrapper from './Wrapper';

function BotListItem({ item }) {
  const content = (
    <Wrapper onClick={() => history.push(`/bot/${item.id}`)}>
      <Avatar
        image={`https://ui-avatars.com/api/?name=${
          item.name
        }&color=555&background=${PRIMARY_COLOR.replace('#', '')}`}
        width="40px"
        height="40px"
      />
      &emsp;
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
