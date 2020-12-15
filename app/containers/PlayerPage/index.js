/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
/**
 *
 * PlayerPage
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
import ChatView from 'components/ChatView';

import { getAccessToken } from 'utils/cookies';
import {
  BOT_SEND_BUTTON_BACKGROUND_COLOR,
  BOT_SEND_BUTTON_ICON_COLOR,
  USER_SEND_BUTTON_BACKGROUND_COLOR,
  USER_SEND_BUTTON_ICON_COLOR,
} from 'utils/constants';
import { filters } from 'utils/filters';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import history from 'utils/history';
import { getTransition, hasOutTransition, isDirectAncestor } from 'utils/bot';

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

const popupListShowKeys = ['ArrowUp'];
const switchInputModeKeys = ['ArrowLeft', 'ArrowRight'];
const emptyBot = { name: '' };

export function PlayerPage({
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
  onAddTransition,
  onDeleteTransition,
}) {
  useInjectReducer({ key: 'playerPage', reducer });
  useInjectSaga({ key: 'playerPage', saga });

  const { botId } = useParams();

  const [inputMode, setInputMode] = useState('bot');
  const [inputText, setInputText] = useState('');
  const [popupListEnabled, setPopupListEnabled] = useState(false);
  const [popupListItems, setPopupListItems] = useState([]);

  const botStates = chatHistory.map(e => e.state);
  const currentState = botStates[botStates.length - 1];
  const { transitionEvent } = chatHistory[chatHistory.length - 1];
  const messages = chatHistory.reduce((a, e, i) => {
    const lastMessage =
      i === 0
        ? {
            state: { id: null },
            transitionEvent: { type: 'response', value: '' },
          }
        : chatHistory[i - 1];
    const lastTransition =
      i === 0
        ? null
        : getTransition(
            model,
            lastMessage.state.id,
            e.state.id,
            lastMessage.transitionEvent,
          );
    a.push({
      id: `${e.state.id}-state-${i}`,
      user: i === 0 ? 'start' : 'bot',
      text: e.state.message,
      responses: e.state.responses || [],
      transitionEvent: e.transitionEvent,
      detachClick: () =>
        !transitionInProgress &&
        lastTransition &&
        onDeleteTransition({
          modelId: model.id,
          transitionId: lastTransition.id,
        }),
      responseClick: response =>
        !transitionInProgress &&
        onSendClick({ type: 'response', value: response }),
    });
    if (e.transitionEvent.value) {
      a.push({
        id: `${e.state.id}-transition-${i}`,
        user: 'user',
        text: e.transitionEvent.value,
        transitionEvent: e.transitionEvent,
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
    : emptyBot;

  const token = getAccessToken();

  // initialize state for a new botId, and clear state when component is unmounted
  useEffect(() => {
    onLoadBot(botId, token);
    onLoadBotModel(botId, token);
    return () => onClearChatHistory();
  }, [botId, token, onLoadBot, onLoadBotModel]);

  useEffect(() => {
    if (model && model.id) {
      onDoTransitionToState({
        modelId: model.id,
        fromStateId: currentState.id,
        event: transitionEvent,
        token,
      });
    }
  }, [model, token, currentState, transitionEvent]);

  useEffect(() => {
    setInputText('');
  }, [inputMode, setInputText]);

  useEffect(() => {
    if (transitionEvent.value || currentState.id === 'START') {
      if (inputMode === 'user') {
        setInputMode('bot');
      }
    }
    if (
      !transitionInProgress &&
      !transitionEvent.value &&
      ((currentState.responses && currentState.responses.length) ||
        hasOutTransition(model, currentState))
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
  }, [bot, inputMode, setInputMode, onSetupHeader]);

  useEffect(() => {
    if (popupListEnabled) {
      if (inputMode === 'bot') {
        const linkStatesHeader = {
          id: 'link-states-header',
          text: 'Go to ...',
          type: 'header',
        };
        const linkStates = model.states
          .filter(
            s =>
              transitionEvent.value !== '' ||
              !isDirectAncestor(model, s.id, currentState.id),
          )
          .map(s => ({
            id: s.id,
            text: s.message,
            click: () => {
              onAddTransition({
                modelId: model.id,
                fromStateId: currentState.id,
                toStateId: s.id,
                event: transitionEvent,
                token,
              });
              setInputText('');
            },
          }));
        if (!linkStates.length) {
          linkStates.push({
            id: 'empty-link',
            text: 'There are no states to go to',
            type: 'item',
          });
        }
        setPopupListItems([linkStatesHeader, ...linkStates]);
      } else {
        const responsesHeader = {
          id: 'responses-header',
          text: 'Responses',
          type: 'header',
        };
        const responseItems = model.transitions
          .filter(t => t.fromStateId === currentState.id)
          .map(t => ({
            id: t.id,
            text:
              t.event.type === 'filter'
                ? filters[t.event.value]
                : t.event.value,
            type: 'item',
            click: () => onSendClick(t.event),
          }));
        if (!responseItems.length) {
          responseItems.push({
            id: 'empty-response',
            text: 'There are no responses defined',
            type: 'item',
          });
        }

        const filterItems = Object.keys(filters)
          .filter(
            f =>
              !model.transitions.some(
                t =>
                  t.fromStateId === currentState.id &&
                  t.event.type === 'filter' &&
                  t.event.value === f,
              ),
          )
          .map(f => ({
            id: f,
            text: filters[f],
            type: 'item',
            click: () => onSendClick({ type: 'filter', value: f }),
          }));
        const filtersHeader = filterItems.length
          ? [
              {
                id: 'filters-header',
                text: 'Filters',
                type: 'header',
              },
            ]
          : [];
        setPopupListItems([
          responsesHeader,
          ...responseItems,
          ...filtersHeader,
          ...filterItems,
        ]);
      }
    } else {
      setPopupListItems([]);
    }
  }, [
    model,
    token,
    currentState,
    popupListEnabled,
    inputMode,
    setPopupListItems,
    setInputText,
  ]);

  const chatViewProps = {
    loading,
    error,
    messages,
    popupListItems,
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
    onFocusOut,
  };

  function onTyping(input) {
    setInputText(input);
  }

  function onKeyDown(event) {
    if (popupListEnabled) {
      setPopupListEnabled(false);
    }
    if (event.keyCode === 13) {
      onSendClick();
    }
    if (popupListShowKeys.some(key => key === event.key)) {
      setPopupListEnabled(true);
      event.preventDefault();
    }
    if (switchInputModeKeys.some(key => key === event.key) && !inputText) {
      setInputMode(inputMode === 'bot' ? 'user' : 'bot');
    }
  }

  function onSendClick(event) {
    const type = (event && event.type) || 'response';
    const value = (event && event.value) || inputText;
    if (inputMode === 'bot') {
      // bot response
      let message = value.trim();
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
        token,
      });
    } else {
      // user response
      onSetTransitionEvent({ type, value }, model.id);
    }
    setInputText('');
  }

  function onFocusOut() {
    if (popupListEnabled) {
      setPopupListEnabled(false);
    }
  }

  return (
    <Container>
      <Helmet>
        <title>{bot.name}</title>
        <meta
          name="description"
          content="Create powerful chatbots rapidly with Rappo.ai"
        />
      </Helmet>
      <ChatView {...chatViewProps} />
      <ChatInputBar {...chatInputBarProps} />
    </Container>
  );
}

PlayerPage.propTypes = {
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
    onLoadBot: (id, token) => dispatch(loadBot(id, token)),
    onSetupHeader: params => dispatch(setupHeader(params)),
    onLoadBotModel: (id, token) => dispatch(loadBotModel(id, true, token)),
    onAddStateWithTransition: params =>
      dispatch(addStateWithTransition(params)),
    onSetTransitionEvent: (event, modelId, token) =>
      dispatch(setTransitionEvent(event, modelId, token)),
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

export default compose(withConnect)(PlayerPage);
