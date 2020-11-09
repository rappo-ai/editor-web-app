/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectSaga } from 'utils/injectSaga';

import HomePage from 'containers/HomePage/Loadable';
import LandingPage from 'containers/LandingPage/Loadable';
import BotEditorPage from 'containers/BotEditorPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';

import {
  makeSelectSession,
  makeSelectUserProfile,
  makeSelectLoading,
  makeSelectError,
} from './selectors';
import saga from './saga';
import { loadCookies, loadUserProfile } from './actions';
import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export function App({
  loading,
  error,
  session,
  profile,
  onLoadCookies,
  onLoadUserProfile,
}) {
  useInjectSaga({ key: 'app', saga });

  useEffect(() => {
    onLoadCookies();
    onLoadUserProfile();
  }, []);

  return (
    <AppWrapper>
      <Helmet titleTemplate="%s - React.js Boilerplate" defaultTitle="rappo.ai">
        <meta
          name="description"
          content="Create friendly bots for your business."
        />
      </Helmet>
      <Header />
      <Switch>
        {session.isLoggedIn ? (
          <Route exact path="/" component={HomePage} />
        ) : (
          <Route exact path="/" component={LandingPage} />
        )}
        <Route exact path="/bots/:botid" component={BotEditorPage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
      {/* <Footer /> */}
      <GlobalStyle />
    </AppWrapper>
  );
}

App.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  session: PropTypes.object,
  profile: PropTypes.object,
  onLoadCookies: PropTypes.func,
  onLoadUserProfile: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  session: makeSelectSession(),
  profile: makeSelectUserProfile(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadCookies: () => dispatch(loadCookies()),
    onLoadUserProfile: () => dispatch(loadUserProfile()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(App);
