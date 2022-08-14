import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 3rem;
`;

export const Header = styled.header`
  width: 100%;
  max-width: 200rem;
  margin: 0 auto;
  padding: 3rem 0;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  @media (max-width: 1024px) {
    flex-direction: column;
    > span + span {
      margin-top: 1.5rem;
    }
  }
`;

export const ListInfo = styled.div`
  font-size: 1.6rem;
  color: var(--dark-gray);
  margin: 3rem 0;
`;

export const Description = styled.div`
  max-width: 40%;
  font-size: 1.6rem;
`;

export const Main = styled.main`
  width: 100%;
  max-width: 200rem;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-bottom: 3rem;
`;

export const ContentListContainer = styled.div`
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
`;
