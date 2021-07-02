import styled from 'styled-components';

export const Container = styled.div`
  ${(props) => props.width && `width: ${props.width};`};
  ${(props) => props.height && `height: ${props.height};`};
  ${(props) => {
    if (props.checked && props.onBorder) {
      return `border: ${props.onBorder};`;
    }
    if (!props.checked && props.offBorder) {
      return `border: ${props.offBorder};`;
    }
  }};
  ${(props) =>
    props.borderRadius
      ? `border-radius: ${props.borderRadius};`
      : `border-radius: ${props.height / 2}px`};
  display: flex;
  justify-content: center;
  align-items: center;

  > div div div svg path {
    ${(props) => {
      if (props.checked && props.checkedColor) {
        return `fill: ${props.checkedColor};`;
      }
      if (!props.checked && props.uncheckedColor) {
        return `fill: ${props.uncheckedColor};`;
      }
    }};
  }
`;
