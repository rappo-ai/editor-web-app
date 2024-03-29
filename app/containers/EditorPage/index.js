/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
/**
 *
 * EditorPage
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

import { getTransition, hasOutTransition, isDirectAncestor } from 'utils/bot';
import {
  BOT_SEND_BUTTON_BACKGROUND_COLOR,
  BOT_SEND_BUTTON_ICON_COLOR,
  USER_SEND_BUTTON_BACKGROUND_COLOR,
  USER_SEND_BUTTON_ICON_COLOR,
  PUBLISH_BOT_ICON_COLOR,
} from 'utils/constants';
import { filters } from 'utils/filters';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import history from 'utils/history';

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
  publishBot,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectModel,
  makeSelectChatHistory,
  makeSelectTransitionInProgress,
  makeSelectPublishUrl,
} from './selectors';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
`;

const popupListShowKeys = ['ArrowUp'];
const replyKeys = { modifiers: ['cmd', 'ctrl'], keys: ['r', 'R'] };
const replyCancelKeys = ['Escape'];
const emptyBot = { name: '' };
const RESPONSE_SEPARATOR = ',';

export function EditorPage({
  loading,
  error,
  bots,
  model,
  chatHistory,
  transitionInProgress,
  publishUrl,
  onLoadBot,
  onSetupHeader,
  onLoadBotModel,
  onAddStateWithTransition,
  onSetTransitionEvent,
  onDoTransitionToState,
  onClearChatHistory,
  onAddTransition,
  onDeleteTransition,
  onPublishBot,
}) {
  useInjectReducer({ key: 'editorPage', reducer });
  useInjectSaga({ key: 'editorPage', saga });

  const { botId } = useParams();

  const [inputMode, setInputMode] = useState('bot');
  const [inputText, setInputText] = useState('');
  const [popupListEnabled, setPopupListEnabled] = useState(false);
  const [popupListItems, setPopupListItems] = useState([]);

  const botStates = chatHistory.map(e => e.state);
  const currentState = botStates[botStates.length - 1];
  const { transitionEvent } = chatHistory[chatHistory.length - 1];
  const replyText = inputMode === 'user' ? currentState.message : '';
  const messages = chatHistory.reduce((a, e, i) => {
    const previousMessage =
      i === 0
        ? {
            state: { id: null },
            transitionEvent: { type: 'response', value: '' },
          }
        : chatHistory[i - 1];
    const previousTransition =
      i === 0
        ? null
        : getTransition(
            model,
            previousMessage.state.id,
            e.state.id,
            previousMessage.transitionEvent,
          );
    const isLastMessage = i === chatHistory.length - 1;
    const hasReplyButton =
      i > 0 &&
      !transitionInProgress &&
      !transitionEvent.value &&
      inputMode === 'bot' &&
      isLastMessage;
    a.push({
      id: `${e.state.id}-state-${i}`,
      user: i === 0 ? 'start' : 'bot',
      text: e.state.message,
      responses: e.state.responses || [],
      transitionEvent: e.transitionEvent,
      detachClick: () => {
        if (!transitionInProgress && previousTransition) {
          onDeleteTransition({
            modelId: model.id,
            transitionId: previousTransition.id,
          });
          setInputMode('bot');
        }
      },
      responseClick: response =>
        !transitionInProgress &&
        onSendClick({ type: 'response', value: response }),
      replyClick: hasReplyButton ? () => setInputMode('user') : null,
    });
    if (e.transitionEvent.value) {
      a.push({
        id: `${e.state.id}-transition-${i}`,
        user: 'user',
        text: e.transitionEvent.value,
        transitionEvent: e.transitionEvent,
      });
    }
    return a;
  }, []);

  if (transitionInProgress) {
    messages.push({
      id: 'typing',
      user: 'typing',
      text: '...',
    });
  }

  const bot = Array.isArray(bots)
    ? bots.find(element => element.id === botId)
    : emptyBot;

  // initialize state for a new botId, and clear state when component is unmounted
  useEffect(() => {
    onLoadBot(botId);
    onLoadBotModel(botId);
    return () => onClearChatHistory();
  }, [botId, onLoadBot, onLoadBotModel]);

  // print publish url to console whenever it changes from '' to some value
  useEffect(() => {
    if (publishUrl) {
      window.open(publishUrl, '_blank');
    }
  }, [publishUrl]);

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
        faClass: 'fa-share-square',
        click: () => {
          onPublishBot({ botId });
        },
        color: PUBLISH_BOT_ICON_COLOR,
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
            text: `${s.message}${s.responses.reduce((r, e, i) => {
              if (i === 0) {
                // eslint-disable-next-line no-param-reassign
                r = `${r}[`;
              }
              if (i === s.responses.length - 1) {
                // eslint-disable-next-line no-param-reassign
                r = `${r}${e}]`;
              } else {
                // eslint-disable-next-line no-param-reassign
                r = `${r}${e}${RESPONSE_SEPARATOR} `;
              }
              return r;
            }, ' ')}`,
            click: () => {
              onAddTransition({
                modelId: model.id,
                fromStateId: currentState.id,
                toStateId: s.id,
                event: transitionEvent,
              });
              setInputText('');
              onPopupListClickOut();
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
    onPopupListClickOut,
  };

  const chatInputBarProps = {
    inputText,
    replyText,
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
    onResponseMenuButtonClick,
    onReplyCancelClick: () => setInputMode('bot'),
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
    function hasModifier(modifier) {
      switch (modifier) {
        case 'cmd':
          return event.metaKey;
        case 'ctrl':
          return event.ctrlKey;
        default:
          break;
      }
      return false;
    }
    if (
      (event.metaKey || event.ctrlKey) &&
      replyKeys.modifiers.some(modifier => hasModifier(modifier)) &&
      replyKeys.keys.some(key => key === event.key) &&
      inputMode === 'bot'
    ) {
      setInputMode('user');
      event.preventDefault();
    }

    if (
      replyCancelKeys.some(key => key === event.key) &&
      inputMode === 'user'
    ) {
      setInputMode('bot');
      event.preventDefault();
    }
  }

  function onResponseMenuButtonClick() {
    setPopupListEnabled(!popupListEnabled);
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
          .split(RESPONSE_SEPARATOR)
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
      onSetTransitionEvent({ type, value }, model.id);
    }
    setInputText('');
    onPopupListClickOut();
  }

  function onPopupListClickOut() {
    setPopupListEnabled(false);
  }

  return (
    <Container>
      <Helmet>
        <title>{bot.name} - Edit</title>
      </Helmet>
      <ChatView {...chatViewProps} />
      <ChatInputBar {...chatInputBarProps} />
    </Container>
  );
}

EditorPage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  bots: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  model: PropTypes.object,
  chatHistory: PropTypes.array,
  transitionInProgress: PropTypes.bool,
  publishUrl: PropTypes.string,
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
  onPublishBot: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  bots: makeSelectBots(),
  model: makeSelectModel(),
  chatHistory: makeSelectChatHistory(),
  transitionInProgress: makeSelectTransitionInProgress(),
  publishUrl: makeSelectPublishUrl(),
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
    onPublishBot: params => dispatch(publishBot(params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(EditorPage);
