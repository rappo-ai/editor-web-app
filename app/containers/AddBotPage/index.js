/**
 *
 * AddBotPage
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { getAccessToken } from 'utils/cookies';
import { PRIMARY_COLOR } from 'utils/constants';

import {
  TripleSectionContainer,
  TripleSection,
} from 'components/TripleSection';
import { Para } from 'components/common';
import { createBot, setupHeader } from 'containers/App/actions';

const AddBotPageSectionContainer = styled(TripleSectionContainer)`
  width: 100%;
  height: 100%;
  padding: 150px 0;
`;

const AddBotPageSection = styled(TripleSection)`
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
export function AddBotPage({ onSetupHeader, onCreateBot }) {
  const token = getAccessToken();

  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const title = 'New Bot';
    const showBackButton = true;
    onSetupHeader({ title, showBackButton });
  }, []);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <AddBotPageSectionContainer direction="column">
      <AddBotPageSection direction="column" position="top">
        <InputContainer>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Name"
            onChange={ev => setName(ev.target.value)}
            onKeyPress={ev => ev.key === 'Enter' && onCreateBot(name, token)}
          />
        </InputContainer>
      </AddBotPageSection>
      <AddBotPageSection direction="column" position="center">
        <Para>Please enter a name for the new bot.</Para>
      </AddBotPageSection>
      <AddBotPageSection direction="column" position="bottom">
        <Button
          disabled={!name.length}
          onClick={() => onCreateBot(name, token)}
        >
          Create
        </Button>
      </AddBotPageSection>
    </AddBotPageSectionContainer>
  );
}

AddBotPage.propTypes = {
  onSetupHeader: PropTypes.func,
  onCreateBot: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    onSetupHeader: ({ title, showBackButton }) =>
      dispatch(setupHeader({ title, showBackButton })),
    onCreateBot: (name, token) => dispatch(createBot(name, token)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(AddBotPage);
