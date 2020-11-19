import styled from 'styled-components';

export const TripleSectionContainer = styled.section`
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  justify-content: space-around;
`;

export const TripleSection = styled.section`
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  align-items: center;
  justify-content: ${props => {
    const map = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
      top: 'flex-start',
      bottom: 'flex-end',
    };
    return map[props.position];
  }};
  flex-grow: ${props => {
    const map = {
      left: '1',
      center: 'initial',
      right: '1',
      top: '1',
      bottom: '1',
    };
    return map[props.position];
  }};
  flex-basis: ${props => {
    const map = {
      left: '0',
      center: 'auto',
      right: '0',
      top: '0',
      bottom: '0',
    };
    return map[props.position];
  }};
`;
