/**
 *
 * NewBotPage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { PRIMARY_COLOR } from 'utils/constants';
import {
  TripleSectionContainer,
  TripleSection,
} from 'components/TripleSection';
import { Para } from 'components/common/Para';
import { createBot, setupHeader } from 'containers/App/actions';

const NewBotPageSectionContainer = styled(TripleSectionContainer)`
  position: relative;
  width: 100%;
  height: 100vh;
  top: -60px;
  padding: 150px 0;
`;

const NewBotPageSection = styled(TripleSection)`
  width: 100%;
`;

const InputContainer = styled.div`
  width: 100%;
  padding: 0 100px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  :focus {
    outline: 2px solid ${PRIMARY_COLOR};
  }
`;

const Button = styled.button`
  background-color: ${PRIMARY_COLOR};
  color: white;
  border: none;
  border-radius: 4px;
  width: 200px;
  height: 40px;
  :hover {
    box-shadow: 0 2px 6px rgba(53, 53, 53, 0.5);
  }
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1.0)};
`;
export function NewBotPage({ onSetupHeader, onCreateBot }) {
  const [name, setName] = useState('');

  useEffect(() => {
    const title = 'New Bot';
    const showBackButton = true;
    onSetupHeader({ title, showBackButton });
  }, []);

  return (
    <NewBotPageSectionContainer direction="column">
      <NewBotPageSection direction="column" position="top">
        <InputContainer>
          <Input
            type="text"
            placeholder="Name"
            onChange={ev => setName(ev.target.value)}
          />
        </InputContainer>
      </NewBotPageSection>
      <NewBotPageSection direction="column" position="center">
        <Para>Please enter a name for the new bot.</Para>
      </NewBotPageSection>
      <NewBotPageSection direction="column" position="bottom">
        <Button disabled={!name.length} onClick={() => onCreateBot(name)}>
          Create
        </Button>
      </NewBotPageSection>
    </NewBotPageSectionContainer>
  );
}

NewBotPage.propTypes = {
  onSetupHeader: PropTypes.func,
  onCreateBot: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    onSetupHeader: ({ title, showBackButton }) =>
      dispatch(setupHeader({ title, showBackButton })),
    onCreateBot: name => dispatch(createBot(name)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(NewBotPage);
