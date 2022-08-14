import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  > button {
    font-size: 1.6rem;
    padding: 0.6rem 3rem 0.6rem 1rem;
    background: ${(props) =>
      props.background ? props.background : `var(--background-400)`};
    border-radius: 0.5rem;
    position: relative;
    outline: none;

    > svg {
      height: 1.5rem;
      position: absolute;
      top: 0.7rem;
      right: 1rem;
      flex-shrink: 0;
    }

    &:hover,
    &:focus {
      background: ${(props) =>
        props.hover ? props.hover : `var(--background-500)`};
      cursor: pointer;
    }

    &:focus {
      outline: 0.2rem solid var(--primary-400);
    }

    > div {
      text-align: left;
      ${(props) => props.width && `width: ${props.width};`}
    }
  }
`;

export const SelectMenu = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--background-100);
  border: 0.01rem solid var(--background-600);
  border-radius: 0.5rem;
  padding: 1rem;
  position: absolute;
  top: 3.5rem;

  ${(props) => props.align === 'left' && 'left: 0;'};
  ${(props) => props.align === 'right' && 'right: 0;'};
  ${(props) =>
    props.align === 'center' &&
    'left: 50%; transform: translate(-50%, -1rem);'};
  z-index: 200;

  ${(props) =>
    props.show
      ? props.align === 'center'
        ? 'opacity: 1; pointer-events: all; transform: translate(-50%, 0);'
        : 'opacity: 1; pointer-events: all; transform: translateY(0);'
      : props.align === 'center'
      ? 'opacity: 0; pointer-events: none; transform: translate(-50%, -1rem);'
      : 'opacity: 0; pointer-events: none; transform: translateY(-1rem);'}
  transition: opacity 0.4s ease, transform 0.4s ease;
`;
