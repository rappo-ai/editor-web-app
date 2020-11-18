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
import Section from './Section';

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
    onSetupHeader('My Bots', userProfile.profilePic, [
      {
        name: 'Home',
        // eslint-disable-next-line no-return-assign
        click: () => (window.location.href = '/'),
      },
      {
        name: 'Logout',
        // eslint-disable-next-line no-return-assign
        click: () => (window.location.href = '/logout'),
      },
    ]);
  }, []);

  const botListProps = {
    loading,
    error,
    bots,
  };

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
        <Section>
          <BotList {...botListProps} />
        </Section>
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
    onSetupHeader: (title, avatarImage, menuItems) =>
      dispatch(setupHeader(title, avatarImage, menuItems)),
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
