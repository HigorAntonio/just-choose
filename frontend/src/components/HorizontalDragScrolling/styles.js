import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`;

export const Slider = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const SliderButton = styled.button`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1rem;

  &:hover {
    cursor: pointer;
  }
`;
