import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  grid-template-rows: 1fr;
  grid-gap: 1rem;

  .cardWrapper {
    display: flex;
  }

  .cardWrapper:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(271 / 181 * 100%);
  }

  > .skeleton {
    position: relative;
  }

  > .skeleton:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(271 / 181 * 100%);
  }
`;

export const Message = styled.span`
  grid-column-start: 1;
  grid-column-end: -1;
`;
