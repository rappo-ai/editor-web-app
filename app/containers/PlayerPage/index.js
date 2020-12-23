/**
 *
 * PlayerPage
 *
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import ChatInputBar from 'components/ChatInputBar';
import ChatView from 'components/ChatView';

import { setupHeader } from 'containers/App/actions';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import {
  USER_SEND_BUTTON_BACKGROUND_COLOR,
  USER_SEND_BUTTON_ICON_COLOR,
} from 'utils/constants';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { hasOutTransition } from 'utils/bot';

import {
  clearChatHistory,
  doTransitionToState,
  loadBotModel,
  loadPlayerBot,
  setTransitionEvent,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectBot,
  makeSelectChatHistory,
  makeSelectModel,
  makeSelectTransitionInProgress,
} from './selectors';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
`;

export function PlayerPage({
  bot,
  chatHistory,
  // eslint-disable-next-line no-unused-vars
  error,
  loading,
  model,
  transitionInProgress,
  onClearChatHistory,
  onDoTransitionToState,
  onLoadPlayerBot,
  onLoadBotModel,
  onSetupHeader,
  onSetTransitionEvent,
}) {
  useInjectReducer({ key: 'playerPage', reducer });
  useInjectSaga({ key: 'playerPage', saga });

  const { botId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get('accessToken');

  const [inputText, setInputText] = useState('');

  const botStates = chatHistory.map(e => e.state);
  const currentState = botStates[botStates.length - 1];
  const { transitionEvent } = chatHistory[chatHistory.length - 1];
  const hasConversationEnded =
    model &&
    model.transitions &&
    !hasOutTransition(model, currentState, transitionEvent);

  const messages = chatHistory.slice(1).reduce((a, e, i) => {
    a.push({
      id: `${e.state.id}-state-${i}`,
      user: 'bot',
      text: e.state.message,
      responses: e.state.responses || [],
      transitionEvent: e.transitionEvent,
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
  if (hasConversationEnded) {
    messages.push({
      id: `end-state`,
      user: 'end',
      text: 'The conversation has ended.',
      responses: [],
    });
  }

  if (transitionInProgress) {
    messages.push({
      id: 'typing',
      user: 'typing',
      text: '...',
      responses: [],
    });
  }

  // initialize state for a new botId, and clear state when component is unmounted
  useEffect(() => {
    onLoadPlayerBot(botId, accessToken);
    onLoadBotModel(botId, accessToken);
    return () => onClearChatHistory();
  }, [botId, accessToken, onLoadPlayerBot, onLoadBotModel]);

  useEffect(() => {
    if (model && model.id) {
      onDoTransitionToState({
        modelId: model.id,
        fromStateId: currentState.id,
        event: transitionEvent,
        accessToken,
      });
    }
  }, [model, accessToken, currentState, transitionEvent]);

  useEffect(() => {
    const title = bot.name;
    onSetupHeader({ title });
  }, [bot, onSetupHeader]);

  const chatViewProps = {
    loading,
    error: false,
    messages,
    popupListItems: [],
  };
  const chatInputBarProps = {
    inputText,
    disabled: transitionInProgress || hasConversationEnded,
    sendButtonColor: USER_SEND_BUTTON_BACKGROUND_COLOR,
    sendButtonIconColor: USER_SEND_BUTTON_ICON_COLOR,
    sendButtonIconClass: 'fa-reply',
    onTyping,
    onKeyDown,
    onSendClick,
    onFocusOut,
  };

  function onTyping(input) {
    setInputText(input);
  }

  function onKeyDown(event) {
    if (event.keyCode === 13) {
      onSendClick();
    }
  }

  function onSendClick(event) {
    const type = (event && event.type) || 'response';
    const value = (event && event.value) || inputText;
    onSetTransitionEvent({ type, value }, model.id);
    setInputText('');
  }

  function onFocusOut() {}

  return (
    <Container>
      <Helmet>
        <title>{bot.name}</title>
        <meta name="description" content={bot.name} />
      </Helmet>
      <ChatView {...chatViewProps} />
      <ChatInputBar {...chatInputBarProps} />
    </Container>
  );
}

PlayerPage.propTypes = {
  bot: PropTypes.object,
  chatHistory: PropTypes.array,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  loading: PropTypes.bool,
  model: PropTypes.object,
  transitionInProgress: PropTypes.bool,
  onClearChatHistory: PropTypes.func,
  onDoTransitionToState: PropTypes.func,
  onLoadPlayerBot: PropTypes.func,
  onLoadBotModel: PropTypes.func,
  onSetupHeader: PropTypes.func,
  onSetTransitionEvent: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  bot: makeSelectBot(),
  chatHistory: makeSelectChatHistory(),
  error: makeSelectError(),
  loading: makeSelectLoading(),
  model: makeSelectModel(),
  transitionInProgress: makeSelectTransitionInProgress(),
});

function mapDispatchToProps(dispatch) {
  return {
    onClearChatHistory: () => dispatch(clearChatHistory()),
    onDoTransitionToState: params => dispatch(doTransitionToState(params)),
    onLoadPlayerBot: (botId, accessToken) =>
      dispatch(loadPlayerBot(botId, accessToken)),
    onLoadBotModel: (botId, accessToken) =>
      dispatch(loadBotModel(botId, accessToken)),
    onSetupHeader: params => dispatch(setupHeader(params)),
    onSetTransitionEvent: (event, modelId) =>
      dispatch(setTransitionEvent(event, modelId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(PlayerPage);
