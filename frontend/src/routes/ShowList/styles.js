import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  padding: 30px 30px 30px;

  > h1 {
    font-size: 36px;
    margin-bottom: 30px;
  }
`;

export const ListInfo = styled.div`
  font-size: 16px;
  color: #999;
`;

export const Description = styled.div`
  max-width: 40%;
  margin-top: 30px;
  font-size: 16px;
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  /* padding: 0 30px; */
`;

export const ContentListContainer = styled.div`
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-template-rows: 1fr;
  grid-gap: 15px;

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
