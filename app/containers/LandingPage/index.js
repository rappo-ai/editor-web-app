/**
 *
 * LandingPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Para } from 'components/common';
import {
  TripleSectionContainer,
  TripleSection,
} from 'components/TripleSection';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectLandingPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const StyledGoogleSignInButton = styled.button`
  height: 40px;
  background-color: #4285f4;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  font-size: 12px;
  :hover {
    box-shadow: 0 2px 6px rgba(53, 53, 53, 0.5);
  }
  padding: 2px;
`;

const GoogleLogoContainer = styled.div`
  width: 36px;
  height: 36px;
  background-color: white;
  border-radius: 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
`;

const GoogleLogoImage = styled.img`
  width: 20px;
  height: 20px;
`;

function GoogleLogo() {
  return (
    <GoogleLogoContainer>
      <GoogleLogoImage
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        alt="google icon"
      />
    </GoogleLogoContainer>
  );
}

function GoogleSignInButton() {
  function onClick() {
    window.location.href = '/login/google';
  }
  return (
    <StyledGoogleSignInButton type="button" onClick={onClick}>
      <GoogleLogo />
      &ensp;Sign In with Google&ensp;
    </StyledGoogleSignInButton>
  );
}

const LandingPageSectionContainer = styled(TripleSectionContainer)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 100px 0;
`;

const LandingPageSection = styled(TripleSection)``;

export function LandingPage() {
  useInjectReducer({ key: 'landingPage', reducer });
  useInjectSaga({ key: 'landingPage', saga });

  return (
    <LandingPageSectionContainer direction="column">
      <Helmet>
        <title />
        <meta name="description" content="Create powerful bots naturally" />
      </Helmet>
      <LandingPageSection position="top" direction="column" />
      <LandingPageSection position="center" direction="column">
        <Para>
          <strong>Rappo</strong> is a natural language interface for easily
          building powerful chatbots.
        </Para>
      </LandingPageSection>
      <LandingPageSection position="bottom" direction="column">
        <GoogleSignInButton />
      </LandingPageSection>
    </LandingPageSectionContainer>
  );
}

/*
LandingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
*/

const mapStateToProps = createStructuredSelector({
  landingPage: makeSelectLandingPage(),
});

/*
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
*/

const withConnect = connect(
  mapStateToProps,
  // mapDispatchToProps,
);

export default compose(withConnect)(LandingPage);
