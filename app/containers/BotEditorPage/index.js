/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
/**
 *
 * BotEditorPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { setupHeader } from 'containers/App/actions';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import ChatInputBar from 'components/ChatInputBar';
import MessageList from 'components/MessageList';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import List from 'components/List';
import ListItem from 'components/ListItem';
import { goToRoute } from 'utils/webapi';

import makeSelectBotEditorPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const PopupMenuOuterContainer = styled.section`
  position: relative;
  width: 100%;
`;

const PopupMenuInnerContainer = styled.div`
  position: absolute;
  bottom: 40px;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const PopupMenuItemContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
function PopupMenuItem({ item }) {
  const content = (
    <PopupMenuItemContainer>
      <p onClick={item.click}>{item.name}</p>
    </PopupMenuItemContainer>
  );
  return <ListItem item={content} />;
}
PopupMenuItem.propTypes = {
  item: PropTypes.object,
};

function PopupMenuList({ items }) {
  return <List component={PopupMenuItem} items={items} />;
}
PopupMenuList.propTypes = {
  items: PropTypes.array,
};

export function BotEditorPage({ loading, error, onSetupHeader }) {
  const bot = {
    name: 'Untitled',
  };
  bot.profilePic = `https://ui-avatars.com/api/?name=${
    bot.name
  }&background=fff`;

  useEffect(() => {
    const title = bot.name;
    const menuIcon = bot.profilePic;
    const menuItems = [
      {
        name: 'Home',
        click: () => goToRoute('/'),
      },
      {
        name: 'Logout',
        click: () => goToRoute('/logout'),
      },
    ];
    onSetupHeader({ title, menuIcon, menuItems });
  }, []);

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

  useInjectReducer({ key: 'botEditorPage', reducer });
  useInjectSaga({ key: 'botEditorPage', saga });

  const menuItems = [
    { id: 0, name: 'Detach', click: () => console.log('detach click') },
    { id: 1, name: 'Delete', click: () => console.log('delete click') },
    {
      id: 2,
      name: 'Delete Tree',
      click: () => console.log('delete tree click'),
    },
  ];

  const messageListProps = {
    loading,
    error,
    messages,
  };
  const chatInputBarProps = {};

  return (
    <Container>
      <Helmet>
        <title>BotEditorPage</title>
        <meta name="description" content="Description of BotEditorPage" />
      </Helmet>
      <MessageList {...messageListProps} />
      <ChatInputBar {...chatInputBarProps} />
      <PopupMenuOuterContainer>
        <PopupMenuInnerContainer>
          <PopupMenuList items={menuItems} />
        </PopupMenuInnerContainer>
      </PopupMenuOuterContainer>
    </Container>
  );
}

BotEditorPage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onSetupHeader: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  botEditorPage: makeSelectBotEditorPage(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSetupHeader: ({ title, menuIcon, menuItems }) =>
      dispatch(setupHeader({ title, menuIcon, menuItems })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(BotEditorPage);
