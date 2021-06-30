import styled from 'styled-components';

import contentProviders from '../../styles/contentProviders';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 250px;
  background: var(--background-400);
  border-radius: 5px;
  padding: 10px;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }

  > div {
    display: flex;
    align-items: center;

    > span {
      margin-left: 10px;
    }
  }
`;

export const Logo = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 5px;
  background: var(--gray);
  background-image: url('${(props) => contentProviders[`${props.src}`]}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
`;
