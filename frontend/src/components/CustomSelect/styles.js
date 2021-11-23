import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  flex-shrink: 0;

  > button {
    font-size: 16px;
    padding: 6px 30px 6px 10px;
    background: var(--background-400);
    border-radius: 5px;
    position: relative;
    outline: none;

    > svg {
      height: 15px;
      position: absolute;
      top: 7px;
      right: 10px;
      flex-shrink: 0;
    }

    &:hover {
      background: var(--background-500);
      cursor: pointer;
    }
  }
`;

export const SelectMenu = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--background-100);
  border: 0.1px solid var(--background-600);
  border-radius: 5px;
  position: absolute;
  top: 35px;
  max-height: 550px;
  overflow: auto;

  ${(props) => props.align === 'left' && `left: 0;`};
  ${(props) => props.align === 'right' && `right: 0;`};
  ${(props) =>
    props.align === 'center' &&
    `left: 50%; transform: translate(-50%, -10px);`};
  z-index: 200;

  ${(props) =>
    props.show
      ? props.align === 'center'
        ? 'opacity: 1; pointer-events: all; transform: translate(-50%, 0);'
        : 'opacity: 1; pointer-events: all; transform: translateY(0);'
      : props.align === 'center'
      ? 'opacity: 0; pointer-events: none; transform: translate(-50%, -10px);'
      : 'opacity: 0; pointer-events: none; transform: translateY(-10px);'}
  transition: opacity 0.4s ease, transform 0.4s ease;
`;
