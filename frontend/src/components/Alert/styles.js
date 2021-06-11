import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-50%);
  font-size: 16px;
  font-weight: bold;
  ${(props) =>
    props.severity === 'info'
      ? `background: var(--accent);`
      : props.severity === 'error'
      ? `background: var(--warning);`
      : `background: var(--success);`}
  ${(props) =>
    props.show
      ? `opacity: 1;
        pointer-events: all;
        transform: translateY(0);`
      : `opacity: 0;
        pointer-events: none;
        max-height: 0;
        padding: 0;
        transform: translateY(-50%);`}
  transition: opacity 0.4s ease, transform 0.4s ease;
`;
