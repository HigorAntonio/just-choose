import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  padding: 30px;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const TitleWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;

  > h1 {
    font-size: 72px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 30px;

    @media (max-width: 1440px) {
      font-size: 54px;
    }

    @media (max-width: 1024px) {
      margin-right: 0;
      margin-bottom: 15px;
    }

    @media (max-width: 768px) {
      font-size: 46px;
    }

    @media (max-width: 580px) {
      font-size: 36px;
    }

    @media (max-width: 320px) {
      font-size: 30px;
    }
  }

  @media (max-width: 1024px) {
    white-space: initial;
    overflow: initial;
  }
`;

export const HeaderButtons = styled.div`
  display: flex;

  > div {
    display: flex;

    > button + button,
    a + button,
    button + a,
    a + a {
      margin-left: 10px;
    }
  }

  > div + div {
    margin-left: 10px;
  }

  > a {
    display: flex;
  }

  @media (max-width: 375px) {
    flex-direction: column;

    > div {
      > button {
        flex: 1;
      }
    }

    > div + div {
      margin-left: 0;
      margin-top: 10px;
    }
  }
`;

export const HeaderButton = styled.button`
  height: 100%;
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

export const HeaderDeleteButton = styled.button`
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
  margin: 30px 0;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CreatedAt = styled.div`
  font-size: 16px;

  > span {
    color: var(--dark-gray);
  }
`;

export const CreatedBy = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;

  > span {
    color: var(--dark-gray);
  }

  > a {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
`;

export const ProfileImageWrapper = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--gray);

  > img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
`;

export const Description = styled.div`
  width: 100%;
  max-width: 650px;
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

  @media (max-width: 768px) {
    padding: 0 15px 20px 15px;
  }
`;
