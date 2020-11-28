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

import {
  addStateWithTransition,
  loadBotModel,
  setTransitionEvent,
  doTransitionToState,
  clearChatHistory,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import { makeSelectModel, makeSelectChatHistory } from './selectors';

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
  model,
  chatHistory,
  onLoadBot,
  onSetupHeader,
  onLoadBotModel,
  onAddStateWithTransition,
  onSetTransitionEvent,
  onDoTransitionToState,
  onClearChatHistory,
}) {
  useInjectReducer({ key: 'botEditorPage', reducer });
  useInjectSaga({ key: 'botEditorPage', saga });

  const { botId } = useParams();

  const [inputMode, setInputMode] = useState('bot');
  const [inputText, setInputText] = useState('');

  const botStates = chatHistory.map(e => e.state);
  const currentState = botStates[botStates.length - 1];
  const { transitionEvent } = chatHistory[chatHistory.length - 1];
  const messages = chatHistory.slice(1).reduce((a, e) => {
    a.push({
      id: e.state.id,
      user: 'bot',
      text: e.state.message,
    });
    if (e.transitionEvent) {
      a.push({
        id: `${e.state.id}-transition`,
        user: 'notbot',
        text: e.transitionEvent,
      });
    }
    return a;
  }, []);

  const bot = Array.isArray(bots)
    ? bots.find(element => element.id === botId)
    : { name: '' };

  // initialize state for a new botId, and clear state when component is unmounted
  useEffect(() => {
    onLoadBot(botId);
    onLoadBotModel(botId);
    return () => onClearChatHistory();
  }, [botId, onLoadBot, onLoadBotModel]);

  useEffect(() => {
    if (model && model.id) {
      onDoTransitionToState({
        modelId: model.id,
        fromStateId: currentState.id,
        event: transitionEvent,
      });
    }
  }, [model, currentState, transitionEvent]);

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
    const actionButtons = [
      {
        faClass: 'fa-retweet',
        click: () => {
          if (transitionEvent !== '') {
            return;
          }
          setInputMode(oldInputMode =>
            oldInputMode === 'bot' ? 'user' : 'bot',
          );
        },
      },
    ];
    onSetupHeader({ title, menuIcon, menuItems, actionButtons });
  }, [bots, transitionEvent, setInputMode]);

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
    if (inputMode === 'bot') {
      onAddStateWithTransition({
        modelId: model.id,
        message: inputText,
        event: transitionEvent,
        fromStateId: currentState.id,
      });
    } else {
      onSetTransitionEvent(inputText, model.id);
      setInputMode('bot');
    }
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
  chatHistory: PropTypes.array,
  onLoadBot: PropTypes.func,
  onSetupHeader: PropTypes.func,
  onLoadBotModel: PropTypes.func,
  onAddStateWithTransition: PropTypes.func,
  onSetTransitionEvent: PropTypes.func,
  onDoTransitionToState: PropTypes.func,
  onClearChatHistory: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  bots: makeSelectBots(),
  model: makeSelectModel(),
  chatHistory: makeSelectChatHistory(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadBot: id => dispatch(loadBot(id)),
    onSetupHeader: params => dispatch(setupHeader(params)),
    onLoadBotModel: id => dispatch(loadBotModel(id, true)),
    onAddStateWithTransition: params =>
      dispatch(addStateWithTransition(params)),
    onSetTransitionEvent: (event, modelId) =>
      dispatch(setTransitionEvent(event, modelId)),
    onDoTransitionToState: params => dispatch(doTransitionToState(params)),
    onClearChatHistory: () => dispatch(clearChatHistory()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(BotEditorPage);
