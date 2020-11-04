import React from 'react';

import H1 from './H1';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';

function Header() {
  return (
    <div>
      <NavBar>
        <HeaderLink to="/">
          <H1>rappo.ai</H1>
        </HeaderLink>
      </NavBar>
    </div>
  );
}

export default Header;
