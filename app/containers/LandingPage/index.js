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

const GoogleLogo = styled.img`
  width: 36px;
  height: 36px;
  background-color: white;
  border-radius: 4px;
`;
function GoogleSignInButton() {
  function onClick() {
    window.location.href = '/login/google';
  }
  return (
    <StyledGoogleSignInButton type="button" onClick={onClick}>
      <GoogleLogo
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        alt="google icon"
      />
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

const Para = styled.p`
  color: #545454;
  font-size: 18px;
  text-align: center;
  padding: 0 100px;
`;

export function LandingPage() {
  useInjectReducer({ key: 'landingPage', reducer });
  useInjectSaga({ key: 'landingPage', saga });

  return (
    <LandingPageSectionContainer direction="column">
      <Helmet>
        <title>rappo.ai</title>
        <meta name="description" content="Create powerful bots instantly" />
      </Helmet>
      <LandingPageSection position="top" direction="column" />
      <LandingPageSection position="center" direction="column">
        <Para>Create powerful bots instantly</Para>
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
