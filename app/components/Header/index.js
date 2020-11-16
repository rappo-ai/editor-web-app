import React from 'react';
import styled from 'styled-components';

import NavBar from './NavBar';
import HeaderLink from './HeaderLink';

function Header() {
  const Container = styled.div`
    height: 75px;
    min-height: 75px;
  `;
  return (
    <Container>
      <NavBar>
        <HeaderLink to="/">
          <h2>rappo.ai</h2>
        </HeaderLink>
      </NavBar>
    </Container>
  );
}

export default Header;
