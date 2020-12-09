/**
 * PopupListItem
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ListItem from 'components/ListItem';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: space-between;
`;

export function PopupListItem({ item }) {
  const content = (
    <Wrapper onClick={item.click}>
      <p>{item.text}</p>
    </Wrapper>
  );

  // Render the content into a list item
  return (
    <ListItem
      key={`popup-list-item-${item.id}`}
      item={content}
      showBorder
      scrollOnMount
    />
  );
}

PopupListItem.propTypes = {
  item: PropTypes.object,
};

export default PopupListItem;
