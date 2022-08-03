import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  flex-shrink: 0;

  > button {
    font-size: 1.6rem;
    padding: 0.6rem 3rem 0.6rem 1rem;
    background: var(--background-400);
    border-radius: 5px;
    position: relative;
    outline: none;

    > svg {
      height: 1.5rem;
      position: absolute;
      top: 0.7rem;
      right: 1rem;
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
  border: 0.01rem solid var(--background-600);
  border-radius: 5px;
  position: absolute;
  top: 3.5rem;
  max-height: 55rem;
  overflow: auto;

  ${(props) => props.align === 'left' && `left: 0;`};
  ${(props) => props.align === 'right' && `right: 0;`};
  ${(props) =>
    props.align === 'center' &&
    `left: 50%; transform: translate(-50%, -1rem);`};
  z-index: 200;

  ${(props) =>
    props.show
      ? props.align === 'center'
        ? 'opacity: 1; pointer-events: initial; transform: translate(-50%, 0);'
        : 'opacity: 1; pointer-events: initial; transform: translateY(0);'
      : props.align === 'center'
      ? 'opacity: 0; pointer-events: none; transform: translate(-50%, -1rem);'
      : 'opacity: 0; pointer-events: none; transform: translateY(-1rem);'}

  /* Faz com que as opções do select que tenham a propriedade
  tabindex="0" por padrão (input, button, .etc) se tornem não 'focaveis'
  (não serão selecionadas através da navegação com a tecla tab)*/
  ${(props) =>
    props.show ? '> * { visibility: visible; }' : '> * { visibility: hidden; }'}
  transition: opacity 0.4s ease, transform 0.4s ease;
`;
