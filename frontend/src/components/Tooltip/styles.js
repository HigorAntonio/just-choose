import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  width: ${(props) => props.width || '12rem'};
  background-color: var(--tooltip);
  border-radius: 6px;
  padding: 0.5rem;
  position: absolute;
  z-index: 1;
  ${(props) =>
    props.position === 'top'
      ? `bottom: ${
          props.spacing ? `calc(100% + ${props.spacing})` : `calc(100% + 1rem)`
        };`
      : `top: ${
          props.spacing ? `calc(100% + ${props.spacing})` : `calc(100% + 1rem)`
        };`}
  left: 50%;
  margin-left: ${(props) =>
    props.width
      ? `-${parseFloat(props.width) / 2}${props.width.replace(
          `${parseFloat(props.width)}`,
          ''
        )}`
      : '-6rem'};
  font-weight: bold;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    margin-left: -0.5rem;
    border-width: 0.5rem;
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
