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

import {
  BOT_SEND_BUTTON_BACKGROUND_COLOR,
  BOT_SEND_BUTTON_ICON_COLOR,
  USER_SEND_BUTTON_BACKGROUND_COLOR,
  USER_SEND_BUTTON_ICON_COLOR,
} from 'utils/constants';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import history from 'utils/history';
import { hasTransition } from 'utils/bot';

import {
  addStateWithTransition,
  loadBotModel,
  setTransitionEvent,
  doTransitionToState,
  clearChatHistory,
  updateState,
  deleteState,
  addTransition,
  deleteTransition,
  branchFromState,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectModel,
  makeSelectChatHistory,
  makeSelectTransitionInProgress,
} from './selectors';

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
  transitionInProgress,
  onLoadBot,
  onSetupHeader,
  onLoadBotModel,
  onAddStateWithTransition,
  onSetTransitionEvent,
  onDoTransitionToState,
  onClearChatHistory,
  onUpdateState,
  onDeleteState,
  onAddTransition,
  onDeleteTransition,
  onBranchFromState,
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
      responses: e.state.responses || [],
    });
    if (e.transitionEvent) {
      a.push({
        id: `${e.state.id}-transition`,
        user: 'notbot',
        text: e.transitionEvent,
        responses: [],
      });
    }
    return a;
  }, []);

  if (transitionInProgress) {
    messages.push({
      id: 'typing',
      user: 'typing',
      text: '...',
      responses: [],
    });
  }

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
    if (transitionEvent) {
      if (inputMode === 'user') {
        setInputMode('bot');
      }
    }
    if (
      !transitionInProgress &&
      ((currentState.responses && currentState.responses.length) ||
        hasTransition(model, currentState))
    ) {
      if (inputMode === 'bot') {
        setInputMode('user');
      }
    }
  }, [
    model,
    transitionInProgress,
    inputMode,
    setInputMode,
    currentState,
    transitionEvent,
  ]);

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
        faClass: 'fa-user',
        click: () => {
          setInputMode(inputMode === 'bot' ? 'user' : 'bot');
        },
        color:
          inputMode === 'bot'
            ? BOT_SEND_BUTTON_BACKGROUND_COLOR
            : USER_SEND_BUTTON_BACKGROUND_COLOR,
      },
    ];
    onSetupHeader({
      title,
      menuIcon,
      menuItems,
      actionButtons,
    });
  }, [bots, transitionEvent, inputMode, setInputMode, onSetupHeader]);

  const messageListProps = {
    loading,
    error,
    messages,
  };
  const chatInputBarProps = {
    inputText,
    disabled: transitionInProgress,
    sendButtonColor:
      inputMode === 'bot'
        ? BOT_SEND_BUTTON_BACKGROUND_COLOR
        : USER_SEND_BUTTON_BACKGROUND_COLOR,
    sendButtonIconColor:
      inputMode === 'bot'
        ? BOT_SEND_BUTTON_ICON_COLOR
        : USER_SEND_BUTTON_ICON_COLOR,
    sendButtonIconClass: inputMode === 'bot' ? 'fa-play' : 'fa-reply',
    onTyping,
    onKeyDown,
    onSendClick,
  };

  function onTyping(input) {
    setInputText(input);
  }

  function onKeyDown(event) {
    if (event.keyCode === 13) {
      onSendClick();
    }
  }

  function onSendClick() {
    if (inputText.charAt(0) === '/') {
      // slash command
      const inputArgs = inputText.split(' ', 2);
      switch (inputArgs[0]) {
        // case '/reply':
        // setInputMode('user');
        // break;
        case '/quick':
          {
            if (inputArgs.length !== 2) {
              break;
            }
            const { message } = currentState;
            const responses = Object.assign([], currentState.responses);
            responses.push(inputArgs[1]);
            onUpdateState({
              modelId: model.id,
              stateId: currentState.id,
              message,
              responses,
            });
          }
          break;
        case '/detach':
          if (inputArgs.length !== 2) {
            break;
          }
          onDeleteTransition({ modelId: model.id, transitionId: inputArgs[1] });
          break;
        case '/delete':
          onDeleteState({ modelId: model.id, stateId: inputArgs[1] });
          break;
        case '/link':
          onAddTransition({
            modelId: model.id,
            fromStateId: currentState.id,
            toStateId: inputArgs[1],
            event: transitionEvent,
          });
          break;
        case '/branch':
          onBranchFromState({ modelId: model.id, stateId: inputArgs[1] });
          break;
        case '/code': // this may practically become '/routine', '/call', etc., but generally there should be some way to handle logic / computation
          break;
        /*
        case '/connect': // bots, spreadsheets, apis, libraries, etc.
          break;
        case '/debug':
          break;
        case '/text':
          // can contain embed links
          break;
        case '/image':
          break;
        case '/audio':
          break;
        case '/video':
          break;
        case '/publish':
          break;
        case '/help':
          break;
        case '/tutorial':
          break; 
          */
        default:
          console.log('unknown slash command');
          break;
      }
    } else if (inputMode === 'bot') {
      // bot response
      let message = inputText.trim();
      const responseRegex = /\[.*\]$/;
      const responseIndex = message.search(responseRegex);
      let responses = [];
      if (responseIndex !== -1) {
        responses = message
          .slice(responseIndex + 1, -1)
          .split('|')
          .map(r => r.trim());
        message = message.slice(0, responseIndex).trim();
      }
      onAddStateWithTransition({
        modelId: model.id,
        message,
        responses,
        event: transitionEvent,
        fromStateId: currentState.id,
      });
    } else {
      // user response
      onSetTransitionEvent(inputText, model.id);
      // setInputMode('bot');
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
  transitionInProgress: PropTypes.bool,
  onLoadBot: PropTypes.func,
  onSetupHeader: PropTypes.func,
  onLoadBotModel: PropTypes.func,
  onAddStateWithTransition: PropTypes.func,
  onSetTransitionEvent: PropTypes.func,
  onDoTransitionToState: PropTypes.func,
  onClearChatHistory: PropTypes.func,
  onUpdateState: PropTypes.func,
  onDeleteState: PropTypes.func,
  onAddTransition: PropTypes.func,
  onDeleteTransition: PropTypes.func,
  onBranchFromState: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  bots: makeSelectBots(),
  model: makeSelectModel(),
  chatHistory: makeSelectChatHistory(),
  transitionInProgress: makeSelectTransitionInProgress(),
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
    onUpdateState: params => dispatch(updateState(params)),
    onDeleteState: params => dispatch(deleteState(params)),
    onAddTransition: params => dispatch(addTransition(params)),
    onDeleteTransition: params => dispatch(deleteTransition(params)),
    onBranchFromState: params => dispatch(branchFromState(params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(BotEditorPage);
