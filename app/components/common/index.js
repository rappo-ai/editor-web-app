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
