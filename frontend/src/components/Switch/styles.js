import styled from 'styled-components';

export const Container = styled.div`
  ${(props) => props.width && `width: ${props.width};`};
  ${(props) => props.height && `height: ${props.height};`};
  ${(props) => {
    if (props.checked && props.border) {
      return `border: ${props.border};`;
    }
    if (!props.checked && props.offborder) {
      return `border: ${props.offborder};`;
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
      if (props.checked && props.checkedcolor) {
        return `fill: ${props.checkedcolor};`;
      }
      if (!props.checked && props.uncheckedcolor) {
        return `fill: ${props.uncheckedcolor};`;
      }
    }};
  }
`;
