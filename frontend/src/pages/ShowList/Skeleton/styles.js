import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  padding: 30px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const ListInfo = styled.div`
  font-size: 16px;
  color: var(--dark-gray);
  margin: 30px 0;
`;

export const Description = styled.div`
  max-width: 40%;
  font-size: 16px;
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 30px;
`;

export const ContentListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-template-rows: 1fr;
  grid-gap: 10px;

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
`;
