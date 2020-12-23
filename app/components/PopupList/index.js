/**
 *
 * PopupList
 *
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import List from 'components/List';
import PopupListItem from 'components/PopupListItem';

import { useOnComponentClickOut } from 'utils/effects';

const Container = styled.div`
  position: absolute;
  bottom: 0;
  max-height: 100%;
  width: 100%;
  overflow: auto;
`;

function PopupList({ items, onClickOut }) {
  const popupListRef = useRef(null);
  useOnComponentClickOut(popupListRef, onClickOut);

  return (
    <Container ref={popupListRef}>
      <List items={items} component={PopupListItem} />
    </Container>
  );
}

PopupList.propTypes = {
  items: PropTypes.array,
  onClickOut: PropTypes.func,
};

export default PopupList;
