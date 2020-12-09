/**
 *
 * PopupList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import List from 'components/List';
import PopupListItem from 'components/PopupListItem';

const Container = styled.div`
  position: absolute;
  bottom: 0;
  max-height: 100%;
  width: 100%;
  overflow: auto;
`;

function PopupList({ items }) {
  return (
    <Container>
      <List items={items} component={PopupListItem} />
    </Container>
  );
}

PopupList.propTypes = {
  items: PropTypes.array,
};

export default PopupList;
