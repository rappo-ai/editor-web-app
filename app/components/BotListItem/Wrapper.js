import styled from 'styled-components';

import { PRIMARY_COLOR } from 'utils/constants';

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
  :hover > * {
    color: ${PRIMARY_COLOR};
  }
`;

export default Wrapper;
