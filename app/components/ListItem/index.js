import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Item from './Item';
import Wrapper from './Wrapper';

function ListItem(props) {
  const { scrollOnMount } = props;
  const itemRef = useRef(null);

  useEffect(() => {
    if (scrollOnMount && itemRef && itemRef.current) {
      itemRef.current.scrollIntoView();
    }
  }, [scrollOnMount, itemRef]);

  return (
    <Wrapper
      className={props.className || 'ListItem'}
      ref={itemRef}
      showBorder={props.showBorder}
    >
      <Item>{props.item}</Item>
    </Wrapper>
  );
}

ListItem.propTypes = {
  item: PropTypes.any,
  className: PropTypes.string,
  scrollOnMount: PropTypes.bool,
  showBorder: PropTypes.bool,
};

export default ListItem;
