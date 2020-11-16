/**
 *
 * BotsList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import BotListItem from 'components/BotListItem';

function BotList({ loading, error, bots }) {
  if (loading) {
    return <List component={LoadingIndicator} />;
  }

  if (error !== false) {
    const ErrorComponent = () => (
      <ListItem item="Something went wrong, please try again!" />
    );
    return <List component={ErrorComponent} />;
  }

  if (bots !== false) {
    return <List items={bots} component={BotListItem} />;
  }

  return null;
}

BotList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  bots: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
};

export default BotList;
