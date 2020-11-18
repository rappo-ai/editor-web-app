import styled from 'styled-components';

export default styled.div`
  height: 60px;
  min-height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background: ${props => props.background || 'rgba(0,0,0,0)'};
  padding: 0 10px;
`;
