/**
 *
 * ActionButtonBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ActionButtonIcon = styled.i`
  margin: 0 5px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${props => props.color || '#777777'};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;
function ActionButtonBar({ buttons, disabled }) {
  return (
    <>
      {buttons &&
        buttons.map(button => {
          const className = `fa fa-2x ${button.faClass}`;
          return (
            <ActionButtonIcon
              disabled={disabled}
              key={className}
              className={className}
              color={button.color}
              aria-hidden="true"
              onClick={button.click}
            />
          );
        })}
    </>
  );
}

ActionButtonBar.propTypes = {
  buttons: PropTypes.array,
  disabled: PropTypes.bool,
};

export default ActionButtonBar;
