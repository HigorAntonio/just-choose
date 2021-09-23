import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  width: ${(props) => props.width || '120px'};
  background-color: var(--tooltip);
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  ${(props) =>
    props.position === 'top'
      ? `bottom: ${
          props.spacing ? `calc(100% + ${props.spacing})` : `calc(100% + 10px)`
        };`
      : `top: ${
          props.spacing ? `calc(100% + ${props.spacing})` : `calc(100% + 10px)`
        };`}
  left: 50%;
  margin-left: ${(props) =>
    props.width
      ? `-${parseFloat(props.width) / 2}${props.width.replace(
          `${parseFloat(props.width)}`,
          ''
        )}`
      : '-60px'};
  font-weight: bold;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${(props) =>
      props.position === 'top'
        ? `var(--tooltip) transparent transparent transparent`
        : `transparent transparent var(--tooltip) transparent`};
    ${(props) => (props.position === 'top' ? `top: 100%;` : `bottom: 100%;`)}
  }

  ${(props) => props.show && `opacity: 1;`}

  ${(props) =>
    props.transitionDuration &&
    `transition: opacity ${props.transitionDuration} ease-in;`}
`;

export const Text = styled.p`
  font-size: 1.35rem;
  font-weight: 500;
  color: var(--tooltip-text);
  text-align: center;
`;
