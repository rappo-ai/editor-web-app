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

import { getAccessToken } from 'utils/cookies';
import { useInjectSaga } from 'utils/injectSaga';

import HomePage from 'containers/HomePage/Loadable';
import LandingPage from 'containers/LandingPage/Loadable';
import NewBotPage from 'containers/NewBotPage';
import EditorPage from 'containers/EditorPage/Loadable';
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
  max-height: 100%;
  height: 100%;
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

  const token = getAccessToken();

  useEffect(() => {
    onLoadCookies(token);
    onLoadUserProfile(token);
  }, [token]);

  return (
    <AppWrapper>
      <Helmet titleTemplate="%s - rappo.ai" defaultTitle="rappo.ai">
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
        <Route exact path="/bot/new" component={NewBotPage} />
        <Route
          exact
          path="/bot/edit/:botId"
          render={props => <EditorPage {...props} playerMode="edit" />}
        />
        <Route
          exact
          path="/bot/play/:botId"
          render={props => <EditorPage {...props} playerMode="play" />}
        />
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
    onLoadCookies: token => dispatch(loadCookies(token)),
    onLoadUserProfile: token => dispatch(loadUserProfile(token)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(App);
