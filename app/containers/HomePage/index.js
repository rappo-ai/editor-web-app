/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { get as getObjectProperty } from 'lodash/object';

import { loadBots, setupHeader } from 'containers/App/actions';
import {
  makeSelectLoading,
  makeSelectError,
  makeSelectBots,
  makeSelectUser,
} from 'containers/App/selectors';
import BotList from 'components/BotList';
import {
  TripleSectionContainer,
  TripleSection,
} from 'components/TripleSection';
import { Para } from 'components/common';

import { getAccessToken } from 'utils/cookies';
import history from 'utils/history';

const HomePageSectionContainer = styled(TripleSectionContainer)`
  width: 100%;
  flex-grow: 1;
  overflow: hidden;
`;

const HomePageSection = styled(TripleSection)`
  height: 100%;
`;

const headerTitle = 'All Bots';
const pageTitle = 'Home';

export function HomePage({
  user,
  bots,
  loading,
  error,
  onLoadBots,
  onSetupHeader,
}) {
  // useInjectReducer({ key, reducer });
  // useInjectSaga({ key, saga });

  const accessToken = getAccessToken();

  useEffect(() => {
    onLoadBots(accessToken);
  }, [accessToken]);

  useEffect(() => {
    const menuIcon = getObjectProperty(user, 'profiles.rappo.profilePic', '');
    const menuItems = [
      {
        name: 'Home',
        click: () => history.push('/'),
      },
      {
        name: 'Logout',
        click: () => {
          window.location.href = '/logout';
        },
      },
    ];
    const actionButtons = [
      {
        faClass: 'fa-plus',
        click: () => history.push('/add/bot'),
      },
    ];
    onSetupHeader({ title: headerTitle, menuIcon, menuItems, actionButtons });
  }, [user, headerTitle]);

  const botListProps = {
    loading,
    error,
    bots,
  };

  const hasBots = !!(bots && Array.isArray(bots) && bots.length);

  return (
    <HomePageSectionContainer direction="column">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Home page of rappo.ai" />
      </Helmet>
      {hasBots && (
        <HomePageSection position="top" direction="column">
          <BotList {...botListProps} />
        </HomePageSection>
      )}
      {!hasBots && (
        <HomePageSection position="center" direction="column">
          <Para>
            You do not have any bots.
            <br />
            <br />
            Click + to create one.
          </Para>
        </HomePageSection>
      )}
    </HomePageSectionContainer>
  );
}

HomePage.propTypes = {
  user: PropTypes.object,
  bots: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onLoadBots: PropTypes.func,
  onSetupHeader: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  bots: makeSelectBots(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadBots: accessToken => dispatch(loadBots(accessToken)),
    onSetupHeader: ({ title, menuIcon, menuItems, actionButtons }) =>
      dispatch(setupHeader({ title, menuIcon, menuItems, actionButtons })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
