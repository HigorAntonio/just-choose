import styled from 'styled-components';

import visible from '../../assets/visibleIcon.png';
import invisible from '../../assets/invisibleIcon.png';

export const Container = styled.div`
  width: 100%;
`;

export const Input = styled.div`
  > input {
    width: 100%;
    background: var(--search);
    padding: 5px 37px 5px 10px;
    border: 2px solid var(--search);
    border-radius: 5px;
    outline: none;

    &:hover {
      border: 2px solid var(--gray);
    }
    &:focus {
      border: 2px solid var(--accent);
    }

    transition: border 0.3s;
  }

  > label {
    margin-bottom: 5px;
    font-weight: bold;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const VisibleIcon = styled.img.attrs((props) => ({
  src: props.src || visible,
  alt: props.alt || 'Mostrar senha',
}))`
  height: 16px;
`;

export const InvisibleIcon = styled.img.attrs((props) => ({
  src: props.src || invisible,
  alt: props.alt || 'Esconder senha',
}))`
  height: 16px;
`;

export const ToggleVisibility = styled.span`
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;

  &:hover {
    background: #ffffff33;
    cursor: pointer;
  }
`;
