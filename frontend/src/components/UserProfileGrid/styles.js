import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${(props) => (props.minWidth ? props.minWidth : '1fr')}, 1fr)
  );
  grid-template-rows: 1fr;
  grid-gap: ${(props) => (props.gridGap ? props.gridGap : '15px')};
`;
