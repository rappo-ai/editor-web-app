import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Para = styled.p`
  color: #545454;
  font-size: 18px;
  text-align: center;
  padding: 0 100px;
`;

export const CircleImage = styled.div`
  background-image: url('${props => props.image}');
  width: ${props => props.width || '50px'};
  height: ${props => props.height || '50px'};
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
  cursor: ${props => (props.pointer ? 'pointer' : 'auto')};
`;

const FAButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.size || '16px'};
  width: ${props => props.width || '36px'};
  height: ${props => props.height || '36px'};
  background-color: ${props => props.color};
  border-radius: 50%;
  cursor: pointer;
`;

const FAButtonIcon = styled.i`
  color: ${props => props.color};
`;

export function FAButton({
  width,
  height,
  disabled,
  backgroundColor,
  iconClass,
  iconColor,
  iconSize,
  onClick,
  className,
}) {
  return (
    <FAButtonContainer
      size={iconSize}
      width={width}
      height={height}
      disabled={disabled}
      onClick={() => !disabled && onClick()}
      color={backgroundColor}
      className={className}
    >
      <FAButtonIcon
        className={`fa ${iconClass}`}
        color={iconColor}
        disabled={disabled}
      />
    </FAButtonContainer>
  );
}

FAButton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  disabled: PropTypes.bool,
  backgroundColor: PropTypes.string,
  iconClass: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
