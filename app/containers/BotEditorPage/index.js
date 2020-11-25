/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
/**
 *
 * BotEditorPage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { loadBot, setupHeader } from 'containers/App/actions';
import {
  makeSelectLoading,
  makeSelectError,
  makeSelectBots,
} from 'containers/App/selectors';
import ChatInputBar from 'components/ChatInputBar';
import MessageList from 'components/MessageList';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import history from 'utils/history';

import { loadBotModel } from './actions';
import reducer from './reducer';
import saga from './saga';
import { makeSelectModel } from './selectors';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
`;

export function BotEditorPage({
  loading,
  error,
  bots,
  model, // eslint-disable-line no-unused-vars
  onLoadBot,
  onSetupHeader,
  onLoadBotModel,
}) {
  useInjectReducer({ key: 'botEditorPage', reducer });
  useInjectSaga({ key: 'botEditorPage', saga });

  const { botId } = useParams();

  const [messages, setMessages] = useState([]);

  const bot = Array.isArray(bots)
    ? bots.find(element => element.id === botId)
    : { name: '' };

  useEffect(() => {
    onLoadBot(botId);
  }, [botId, onLoadBot]);

  useEffect(() => {
    onLoadBotModel(botId);
  }, [botId, onLoadBotModel]);

  useEffect(() => {
    const title = bot.name;
    const menuIcon = `https://ui-avatars.com/api/?name=${bot.name}
    &background=fff`;
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
    onSetupHeader({ title, menuIcon, menuItems });
  }, [bots]);

  const [inputText, setInputText] = useState('');

  const messageListProps = {
    loading,
    error,
    messages,
  };
  const chatInputBarProps = {
    inputText,
    onTyping,
    onSendClick,
  };

  function onTyping(input) {
    setInputText(input);
  }

  function onSendClick() {
    setMessages(prevMessages => {
      const newMessages = [...prevMessages];
      newMessages.push({
        id: newMessages.length,
        user: 'bot',
        text: inputText,
      });
      return newMessages;
    });
    setInputText('');
  }

  return (
    <Container>
      <Helmet>
        <title>{bot.name}</title>
        <meta name="description" content="Description of BotEditorPage" />
      </Helmet>
      <MessageList {...messageListProps} />
      <ChatInputBar {...chatInputBarProps} />
    </Container>
  );
}

BotEditorPage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  bots: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  model: PropTypes.object,
  onLoadBot: PropTypes.func,
  onSetupHeader: PropTypes.func,
  onLoadBotModel: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  bots: makeSelectBots(),
  model: makeSelectModel(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadBot: id => dispatch(loadBot(id)),
    onSetupHeader: ({ title, menuIcon, menuItems }) =>
      dispatch(setupHeader({ title, menuIcon, menuItems })),
    onLoadBotModel: id => dispatch(loadBotModel(id, true)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(BotEditorPage);
