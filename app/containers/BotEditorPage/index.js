/**
 *
 * BotEditorPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import ChatInputBar from 'components/ChatInputBar';
import MessageList from 'components/MessageList';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectBotEditorPage from './selectors';
import reducer from './reducer';
import saga from './saga';

export function BotEditorPage({ loading, error }) {
  useInjectReducer({ key: 'botEditorPage', reducer });
  useInjectSaga({ key: 'botEditorPage', saga });

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;
  `;
  const messages = [
    {
      id: 0,
      user: 'bot',
      text:
        'Hello world! Hello world! Hello world! Hello world! Hello world! Hello world! Hello world! Hello world! ',
    },
    { id: 1, user: 'notbot', text: 'Nice to meet you!' },
    { id: 2, user: 'bot', text: 'Nice to meet you!' },
    { id: 3, user: 'notbot', text: 'Nice to meet you!' },
    { id: 4, user: 'bot', text: 'Nice to meet you!' },
    { id: 5, user: 'notbot', text: 'Nice to meet you!' },
    { id: 6, user: 'bot', text: 'Nice to meet you!' },
    { id: 7, user: 'notbot', text: 'Nice to meet you!' },
    { id: 8, user: 'bot', text: 'Nice to meet you!' },
    { id: 9, user: 'notbot', text: 'Nice to meet you!' },
    { id: 10, user: 'bot', text: 'Nice to meet you!' },
  ];
  const messageListProps = {
    loading,
    error,
    messages,
  };
  const userInputProps = {};

  return (
    <Container>
      <Helmet>
        <title>BotEditorPage</title>
        <meta name="description" content="Description of BotEditorPage" />
      </Helmet>
      <MessageList {...messageListProps} />
      <ChatInputBar {...userInputProps} />
    </Container>
  );
}

BotEditorPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  botEditorPage: makeSelectBotEditorPage(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(BotEditorPage);
