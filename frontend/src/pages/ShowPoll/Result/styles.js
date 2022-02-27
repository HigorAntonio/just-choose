import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  background: var(--background-100);
  border: 0.1px solid var(--background-600);
  border-radius: 5px;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 0.1px solid var(--background-600);

  > div h2 {
    font-size: 2rem;
  }

  .headerPosition {
    width: 15%;
    min-width: 40px;
    text-align: center;
  }

  .headerTitle {
    width: 65%;
    text-align: center;
  }

  .headerVotes {
    width: 20%;
    min-width: 40px;
    text-align: center;
  }

  @media (max-width: 500px) {
    padding: 10px;
  }
`;

export const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;

  @media (max-width: 500px) {
    padding: 10px;
  }

  .row {
    display: flex;
    justify-content: space-between;

    & + .row {
      margin-top: 15px;

      @media (max-width: 500px) {
        margin-top: 5px;
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
    min-width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--background-500);
    border-radius: 5px 0 0 5px;
    font-weight: bold;
    font-size: 40px;
  }

  .bodyTitle {
    width: 65%;
    display: flex;
    background: var(--background-500);
    margin: 0 15px;
    overflow: hidden;

    > .titleWrapper {
      display: flex;
      align-items: center;
      padding: 15px;
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
      margin: 0 5px;
    }
  }

  .bodyVotes {
    width: 20%;
    min-width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--background-500);
    border-radius: 0 5px 5px 0;
    font-weight: bold;
    font-size: 40px;
  }

  .bodyPosition,
  .bodyVotes {
    @media (max-width: 768px) {
      font-size: 28px;
    }

    @media (max-width: 580px) {
      font-size: 20px;
    }

    @media (max-width: 320px) {
      font-size: 16px;
    }
  }

  .posterWrapper {
    flex-shrink: 0;
    display: flex;
    width: 70px;

    &:hover {
      cursor: pointer;
    }

    @media (max-width: 640px) {
      width: 40px;
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
