import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 90rem;
  background: var(--background-100);
  border: 0.01rem solid var(--background-600);
  border-radius: 0.5rem;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  border-bottom: 0.01rem solid var(--background-600);

  > div h2 {
    font-size: 2rem;
  }

  .headerPosition {
    width: 15%;
    min-width: 4rem;
    text-align: center;
  }

  .headerTitle {
    width: 65%;
    text-align: center;
  }

  .headerVotes {
    width: 20%;
    min-width: 4rem;
    text-align: center;
  }

  @media (max-width: 500px) {
    padding: 1rem;
  }
`;

export const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;

  @media (max-width: 500px) {
    padding: 1rem;
  }

  .row {
    display: flex;
    justify-content: space-between;

    & + .row {
      margin-top: 1.5rem;

      @media (max-width: 500px) {
        margin-top: 0.5rem;
      }
    }

    &:hover {
      cursor: pointer;
    }

    &:hover > div {
      background: var(--background-600);
    }
  }

  .bodyPosition {
    width: 15%;
    min-width: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--background-500);
    border-radius: 0.5rem 0 0 0.5rem;
    font-weight: bold;
    font-size: 4rem;
  }

  .bodyTitle {
    width: 65%;
    display: flex;
    background: var(--background-500);
    margin: 0 1.5rem;
    overflow: hidden;

    > .titleWrapper {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      overflow: hidden;

      > .titleText {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3; /* number of lines to show */
        -webkit-box-orient: vertical;
        word-break: break-word;

        @media (max-width: 640px) {
          -webkit-line-clamp: 2; /* number of lines to show */
        }
      }
    }

    @media (max-width: 500px) {
      margin: 0 0.5rem;
    }
  }

  .bodyVotes {
    width: 20%;
    min-width: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--background-500);
    border-radius: 0 0.5rem 0.5rem 0;
    font-weight: bold;
    font-size: 4rem;
  }

  .bodyPosition,
  .bodyVotes {
    @media (max-width: 768px) {
      font-size: 2.8rem;
    }

    @media (max-width: 580px) {
      font-size: 2rem;
    }

    @media (max-width: 320px) {
      font-size: 1.6rem;
    }
  }

  .posterWrapper {
    flex-shrink: 0;
    display: flex;
    width: 7rem;

    &:hover {
      cursor: pointer;
    }

    @media (max-width: 640px) {
      width: 4rem;
    }
  }

  .posterWrapper:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    padding-bottom: calc(271 / 181 * 100%);
  }
`;
