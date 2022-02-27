import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-template-rows: 1fr;
  grid-gap: 10px;
`;

export const CardWrapper = styled.div`
  display: flex;

  > a {
    width: 100%;
    height: 100%;
  }

  &:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(271 / 181 * 100%);
  }
`;
