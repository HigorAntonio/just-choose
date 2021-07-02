import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  padding: 30px 30px 30px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  > h1 {
    font-size: 72px;
  }
`;

export const HeaderButtons = styled.div`
  display: flex;

  > div + div,
  a + div,
  div + a,
  a + a {
    margin-left: 10px;
  }

  > a {
    display: flex;
  }
`;

export const HeaderButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 10px;
  background: var(--background-600);

  > span {
    margin-left: 10px;
    font-size: 25px;
  }

  &:hover {
    background: var(--tooltip);
    cursor: pointer;

    > span {
      color: var(--tooltip-text);
    }

    > svg {
      fill: var(--tooltip-text);
    }
  }
`;

export const HeaderDeleteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 10px;
  background: var(--background-600);

  > svg {
    fill: var(--error);
  }

  > span {
    margin-left: 10px;
    font-size: 25px;
  }

  &:hover {
    background: var(--error);
    cursor: pointer;

    > svg {
      fill: var(--white);
    }
  }
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

export const Filters = styled.div`
  display: flex;
  margin-top: 30px;
  align-items: center;

  > label {
    font-size: 14px;
    font-weight: bold;
    margin-right: 15px;
  }
`;

export const TypeOptions = styled.div`
  width: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
  > div + div {
    margin-top: 10px;
  }
`;

export const Option = styled.div`
  width: 100%;
  background: var(--background-400);
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0 30px 30px 30px;
`;

export const ContentListContainer = styled.div`
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
