/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { loadBots, setupHeader } from 'containers/App/actions';
import {
  makeSelectLoading,
  makeSelectError,
  makeSelectBots,
  makeSelectUserProfile,
} from 'containers/App/selectors';
import BotList from 'components/BotList';
import { Para } from 'components/common/Para';
import { goToRoute } from 'utils/webapi';
import Section from './Section';
import CenteredSection from './CenteredSection';

// const key = 'home';

export function HomePage({
  userProfile,
  bots,
  loading,
  error,
  onLoadBots,
  onSetupHeader,
}) {
  // useInjectReducer({ key, reducer });
  // useInjectSaga({ key, saga });

  useEffect(() => {
    onLoadBots();
  }, []);

  useEffect(() => {
    const title = 'My Bots';
    const { profilePic } = userProfile;
    const menuActions = [
      {
        name: 'Home',
        click: () => goToRoute('/'),
      },
      {
        name: 'Logout',
        click: () => goToRoute('/logout'),
      },
    ];
    const actionButtons = [
      {
        faClass: 'fa-plus',
        click: () => console.log('+ clicked'),
      },
    ];
    onSetupHeader(title, profilePic, menuActions, actionButtons);
  }, []);

  const botListProps = {
    loading,
    error,
    bots,
  };

  const hasBots = !!(bots && Array.isArray(bots) && bots.length);

  return (
    <article>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <div>
        {hasBots && (
          <Section>
            <BotList {...botListProps} />
          </Section>
        )}
        {!hasBots && (
          <CenteredSection>
            <Para>
              You do not have any bots.
              <br />
              <br />
              Click + to create one.
            </Para>
          </CenteredSection>
        )}
      </div>
    </article>
  );
}

HomePage.propTypes = {
  userProfile: PropTypes.object,
  bots: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onLoadBots: PropTypes.func,
  onSetupHeader: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUserProfile(),
  bots: makeSelectBots(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadBots: () => dispatch(loadBots()),
    onSetupHeader: (title, menuIcon, menuItems, actionButtons) =>
      dispatch(setupHeader(title, menuIcon, menuItems, actionButtons)),
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
