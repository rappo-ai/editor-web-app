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
import { Switch, Route, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { getAccessToken } from 'utils/cookies';
import { useInjectSaga } from 'utils/injectSaga';

import AddBotPage from 'containers/AddBotPage';
import EditorPage from 'containers/EditorPage/Loadable';
import HomePage from 'containers/HomePage/Loadable';
import LandingPage from 'containers/LandingPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import PlayerPage from 'containers/PlayerPage/Loadable';
import WaitlistPage from 'containers/WaitlistPage';

import Header from 'components/Header';

import {
  makeSelectSession,
  makeSelectUser,
  makeSelectLoading,
  makeSelectError,
} from './selectors';
import saga from './saga';
import { loadCookies, loadUser } from './actions';
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
  user,
  onLoadCookies,
  onLoadUser,
}) {
  useInjectSaga({ key: 'app', saga });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let accessToken = queryParams.get('token');
  if (!accessToken) {
    accessToken = getAccessToken();
  }

  useEffect(() => {
    onLoadCookies();
    onLoadUser(accessToken);
  }, [accessToken]);

  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s | Rappo"
        defaultTitle="Automate conversations with everyone | Rappo"
      >
        <title>Automate conversations with everyone</title>
        <meta
          name="description"
          content="Automate conversations with everyone."
        />
      </Helmet>
      <Header />
      <Switch>
        {session.isLoggedIn && user.isActivated && (
          <Route exact path="/" component={HomePage} />
        )}
        {session.isLoggedIn && !user.isActivated && (
          <Route exact path="/" component={WaitlistPage} />
        )}
        {!session.isLoggedIn && (
          <Route exact path="/" component={LandingPage} />
        )}
        <Route exact path="/add/bot" component={AddBotPage} />
        <Route
          exact
          path="/edit/bot/:botId"
          render={props => <EditorPage {...props} />}
        />
        <Route
          exact
          path="/play/bot/:botId"
          render={props => <PlayerPage {...props} />}
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
  user: PropTypes.object,
  onLoadCookies: PropTypes.func,
  onLoadUser: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  session: makeSelectSession(),
  user: makeSelectUser(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadCookies: () => dispatch(loadCookies()),
    onLoadUser: accessToken => dispatch(loadUser(accessToken)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(App);
