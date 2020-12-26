import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { PRIMARY_COLOR } from 'utils/constants';
import history from 'utils/history';
import { useOnComponentClickOut } from 'utils/effects';

import ActionButtonBar from 'components/ActionButtonBar';
import {
  TripleSectionContainer,
  TripleSection,
} from 'components/TripleSection';
import { CircleImage as MenuIcon } from 'components/common';
import { makeSelectSession, makeSelectHeader } from 'containers/App/selectors';
import HeaderLink from './HeaderLink';
import Logo from './Logo';

const NavBar = styled(TripleSectionContainer)`
  height: 60px;
  min-height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background: ${props => props.background || 'rgba(0,0,0,0)'};
  padding: 0 10px;
  z-index: 1;
`;

const NavSection = styled(TripleSection)`
  flex-direction: row;
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

const PopupContainer = styled.section`
  position: absolute;
  top: 60px;
  margin-left: 10px;
  border-radius: 4px;
  background: #333333;
  color: white;
  z-index: 1;
  box-shadow: 0 2px 12px rgba(53, 53, 53, 0.5);
`;
const PopupUl = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 10px 20px;
`;
const PopupLi = styled.li`
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
    color: ${PRIMARY_COLOR};
  }
  user-select: none;
`;

function PopupMenu({ items, onClickOut }) {
  const containerRef = useRef(null);
  useOnComponentClickOut(containerRef, onClickOut);

  return (
    <PopupContainer ref={containerRef}>
      <PopupUl>
        {items.map((item, index) => (
          <PopupLi
            unselectable="on"
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={() => {
              item.click();
              onClickOut();
            }}
          >
            {item.name}
          </PopupLi>
        ))}
      </PopupUl>
    </PopupContainer>
  );
}

PopupMenu.propTypes = {
  items: PropTypes.array,
  onClickOut: PropTypes.func,
};

const Title = styled.h3`
  font-weight: bold;
  color: #333333;
  user-select: none;
`;

const BackButton = styled.p`
  color: #333333;
  cursor: pointer;
`;

function EditorHeader({ header }) {
  const [isPopupMenu, setIsPopupMenu] = useState(false);

  return (
    <>
      <NavBar background="#f0f0f0">
        <NavSection position="left">
          {header.showBackButton && (
            <BackButton onClick={() => history.goBack()}>&lt; Back</BackButton>
          )}
          {header.menuIcon && (
            <MenuIcon
              pointer
              width="50px"
              height="50px"
              image={header.menuIcon}
              onClick={() => setIsPopupMenu(!isPopupMenu)}
            />
          )}
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
