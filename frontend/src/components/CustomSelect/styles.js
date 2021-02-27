import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  > button {
    font-size: 16px;
    padding: 5px 30px 5px 10px;
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
  background: green;
  border-radius: 5px;
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translate(-50%);
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
