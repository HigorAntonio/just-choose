import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div``;

export const Title = styled.h2`
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

export const Main = styled.div`
  > div {
    margin-bottom: 2rem;
  }
`;

export const Footer = styled.div``;

export const BottomLineWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 1rem;
  margin-bottom: 2rem;
`;

export const BottomLine = styled.div`
  flex: 1;
  border-bottom: 0.1rem solid var(--background-700);
`;

export const BottomLineButtonWrapper = styled.div`
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
`;

export const BottomLineButton = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;

  &:hover {
    background: var(--background-700);
  }
`;

export const BottomLineButtonLabel = styled.div`
  padding: 0 1rem;
`;

export const BottomLineIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BottomLineIcon = styled.figure`
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  > svg {
    width: 1.25rem;
    fill: var(--primary-400);
  }
`;

export const BottomLineTextWrapper = styled.div`
  margin-right: 0.5rem;
`;

export const BottomLineText = styled.p`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-400);
`;
