import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession, makeSelectHeader } from 'containers/App/selectors';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Logo from './Logo';

const NavSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: ${props => {
    const map = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    };
    return map[props.position];
  }};
  flex-grow: ${props => {
    const map = {
      left: '1',
      center: 'initial',
      right: '1',
    };
    return map[props.position];
  }};
  flex-basis: ${props => {
    const map = {
      left: '0',
      center: 'auto',
      right: '0',
    };
    return map[props.position];
  }};
`;

function LogoHeader() {
  return (
    <NavBar>
      <NavSection position="center">
        <HeaderLink to="/">
          <Logo>rappo.ai</Logo>
        </HeaderLink>
      </NavSection>
    </NavBar>
  );
}

const MenuIcon = styled.div`
  background-image: url('${props => props.image}');
    
  /* make a square container */
  width: 40px;
  height: 40px;

  /* fill the container, preserving aspect ratio, and cropping to fit */
  background-size: cover;

  /* center the image vertically and horizontally */
  background-position: top center;

  /* round the edges to a circle with border radius 1/2 container size */
  border-radius: 50%;

  cursor: pointer;
`;

function ActionButtonBar() {
  return <div />;
}

function PopupMenu({ items, onClickOut }) {
  const containerRef = useRef(null);

  useEffect(() => {
    function onWindowClick(ev) {
      if (!containerRef.current.contains(ev.target)) {
        onClickOut();
      }
    }
    window.addEventListener('click', onWindowClick);
    return () => {
      window.removeEventListener('click', onWindowClick);
    };
  });
  const myContainer = styled.section`
    position: absolute;
    top: 60px;
    margin-left: 10px;
    border-radius: 4px;
    background: #333333;
    color: white;
    z-index: 1;
    box-shadow: 0 2px 12px rgba(53, 53, 53, 0.5);
  `;
  const myUl = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 10px 20px;
  `;
  const myLi = styled.li`
    border-top: 1px solid gray;
    &:first-child {
      border-top: none;
      padding-top: 0;
      margin-top: 0;
    }
    margin-top: 5px;
    padding-top: 5px;
    cursor: pointer;
    :hover {
      color: pink;
    }
    user-select: none;
  `;

  return (
    <myContainer ref={containerRef}>
      <myUl>
        {items.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <myLi unselectable="on" key={index} onClick={item.click}>
            {item.name}
          </myLi>
        ))}
      </myUl>
    </myContainer>
  );
}

PopupMenu.propTypes = {
  items: PropTypes.array,
  onClickOut: PropTypes.func,
};

const Title = styled.h3`
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  color: #333333;
  user-select: none;
`;
function EditorHeader({ header }) {
  const [isPopupMenu, setIsPopupMenu] = useState(false);

  return (
    <>
      <NavBar background="#d9d9d9">
        <NavSection position="left">
          <MenuIcon
            image={header.avatarImage}
            onClick={() => setIsPopupMenu(!isPopupMenu)}
          />
        </NavSection>
        <NavSection position="center">
          <Title unselectable="on">{header.title}</Title>
        </NavSection>
        <NavSection position="right">
          <ActionButtonBar buttons={header.actionButtons} />
        </NavSection>
      </NavBar>
      {isPopupMenu && (
        <PopupMenu
          items={header.menuItems}
          onClickOut={() => setIsPopupMenu(false)}
        />
      )}
    </>
  );
}

function Header({ session, header }) {
  return (
    <>
      {!session.isLoggedIn && <LogoHeader />}
      {session.isLoggedIn && <EditorHeader header={header} />}
    </>
  );
}

Header.propTypes = {
  session: PropTypes.object,
  header: PropTypes.object,
};

EditorHeader.propTypes = {
  header: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  session: makeSelectSession(),
  header: makeSelectHeader(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(Header);
