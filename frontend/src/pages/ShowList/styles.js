import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 3rem;

  @media (max-width: 768px) {
    margin: 0 2rem;
  }
`;

export const Header = styled.header`
  width: 100%;
  max-width: 200rem;
  margin: 0 auto;
  padding: 3rem 0;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
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
    font-size: 7.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 3rem;

    @media (max-width: 1440px) {
      font-size: 5.4rem;
    }

    @media (max-width: 1024px) {
      margin-right: 0;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      font-size: 4.6rem;
    }

    @media (max-width: 580px) {
      font-size: 3.6rem;
    }

    @media (max-width: 320px) {
      font-size: 3rem;
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
      margin-left: 1rem;
    }
  }

  > div + div {
    margin-left: 1rem;
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
      margin-top: 1rem;
    }
  }
`;

export const HeaderButton = styled.button`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding: 1rem;
  background: var(--background-600);

  > span {
    margin-left: 1rem;
    font-size: 2.5rem;
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
  border-radius: 0.5rem;
  padding: 1rem;
  background: var(--background-600);

  > svg {
    fill: var(--error);
  }

  > span {
    margin-left: 1rem;
    font-size: 2.5rem;
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
  margin: 3rem 0;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CreatedAt = styled.div`
  font-size: 1.6rem;

  > span {
    color: var(--dark-gray);
  }
`;

export const CreatedBy = styled.div`
  font-size: 1.6rem;
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
    object-fit: cover;
    ${(props) => !props.src && 'display: none;'}
  }
`;

export const Description = styled.div`
  width: 100%;
  max-width: 65rem;
  font-size: 1.6rem;
`;

export const Filters = styled.div`
  display: flex;
  margin-top: 3rem;
  align-items: center;

  > label {
    font-size: 1.4rem;
    font-weight: bold;
    margin-right: 1.5rem;
  }
`;

export const TypeOptions = styled.div`
  width: 10rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  > div + div {
    margin-top: 1rem;
  }
`;

export const Option = styled.div`
  width: 100%;
  background: var(--background-400);
  padding: 1rem;
  border-radius: 0.5rem;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }
`;

export const Main = styled.main`
  width: 100%;
  max-width: 200rem;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-bottom: 3rem;

  @media (max-width: 768px) {
    padding-bottom: 2rem;
  }
`;
