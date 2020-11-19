import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PRIMARY_COLOR } from 'utils/constants';

export default styled(Link)`
  display: inline-flex;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 12px;
  color: ${PRIMARY_COLOR};
`;
