import styled from 'styled-components';

import PictureIcon from '../../assets/PictureIcon.png';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.11);
  display: flex;
  align-items: center;
  justify-content: center;

  > div.check-box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 5px;
    width: 30px;
    height: 30px;
    background: rgba(0, 0, 0, 0.55);

    &::before {
      content: '';
      position: absolute;
      top: 30px;
      left: 0px;
      border-top: 7.5px solid rgba(0, 0, 0, 0.55);
      border-right: 7.5px solid transparent;
      border-bottom: 7.5px solid transparent;
      border-left: 7.5px solid rgba(0, 0, 0, 0.55);
    }

    &::after {
      content: '';
      position: absolute;
      top: 30px;
      right: 0px;
      border-top: 7.5px solid rgba(0, 0, 0, 0.55);
      border-right: 7.5px solid rgba(0, 0, 0, 0.55);
      border-bottom: 7.5px solid transparent;
      border-left: 7.5px solid transparent;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.8);
      cursor: pointer;

      &::before {
        content: '';
        position: absolute;
        top: 30px;
        left: 0px;
        border-top: 7.5px solid rgba(0, 0, 0, 0.8);
        border-right: 7.5px solid transparent;
        border-bottom: 7.5px solid transparent;
        border-left: 7.5px solid rgba(0, 0, 0, 0.8);
      }

      &::after {
        content: '';
        position: absolute;
        top: 30px;
        right: 0px;
        border-top: 7.5px solid rgba(0, 0, 0, 0.8);
        border-right: 7.5px solid rgba(0, 0, 0, 0.8);
        border-bottom: 7.5px solid transparent;
        border-left: 7.5px solid transparent;
      }
    }
  }
`;

export const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${(props) => props.error && 'display: none;'}
`;
