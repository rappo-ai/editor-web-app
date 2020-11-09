/**
 *
 * BotEditorPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectBotEditorPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function BotEditorPage() {
  useInjectReducer({ key: 'botEditorPage', reducer });
  useInjectSaga({ key: 'botEditorPage', saga });

  return (
    <div>
      <Helmet>
        <title>BotEditorPage</title>
        <meta name="description" content="Description of BotEditorPage" />
      </Helmet>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

BotEditorPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  botEditorPage: makeSelectBotEditorPage(),
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
