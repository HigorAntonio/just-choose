import styled from 'styled-components';

import contentProviders from '../../styles/contentProviders';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 25rem;
  background: var(--background-400);
  border-radius: 0.5rem;
  padding: 1rem;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }

  > div {
    display: flex;
    align-items: center;

    > span {
      margin-left: 1rem;
    }
  }
`;

export const Logo = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.5rem;
  background: var(--gray);
  background-image: url('${(props) => contentProviders[`${props.src}`]}');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
`;
