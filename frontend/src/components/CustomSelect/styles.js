import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  > button {
    font-size: 16px;
    padding: 6px 30px 6px 10px;
    background: var(--search);
    border-radius: 5px;
    position: relative;
    outline: none;

    > svg {
      height: 15px;
      position: absolute;
      top: 7px;
      right: 10px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      cursor: pointer;
    }
  }
`;

export const FilterDropDown = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--nav-bar);
  border: 0.1px solid var(--search);
  border-radius: 5px;
  padding: 10px;
  position: absolute;
  top: 35px;
  z-index: 200;
`;

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  cursor: pointer;
`;
