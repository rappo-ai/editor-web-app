import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from './A';
import H1 from './H1';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
import messages from './messages';

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
