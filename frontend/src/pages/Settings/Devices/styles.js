import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  > h3 {
    margin-bottom: 2rem;
  }

  > div + h3 {
    margin-top: 4rem;
  }
`;

export const Device = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1.4rem;
  word-break: break-word;
`;

export const DeviceOS = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
`;

export const DeviceBrowser = styled.p``;

export const LayoutBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 90rem;
  background: var(--background-100);
  border: 0.01rem solid var(--background-600);
  border-radius: 0.5rem;

  > div {
    padding: 2rem;
  }

  > ${Device} + ${Device} {
    border-top: 0.01rem solid var(--background-600);
  }

  @media (max-width: 1130px) {
    width: 100%;
  }
`;

export const ExitButton = styled.button`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.4rem;
  height: 3.1rem;
  white-space: nowrap;
  outline: none;
  padding: 0.7rem 2rem;
  background: var(--background-400);
  border-radius: 0.5rem;

  &:hover {
    background: var(--background-500);
    cursor: pointer;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
