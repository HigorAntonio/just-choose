import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div``;

export const Title = styled.h2`
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

export const Main = styled.div`
  > div {
    margin-bottom: 20px;
  }
`;

export const Footer = styled.div``;

export const BottomLineWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 10px;
  margin-bottom: 20px;
`;

export const BottomLine = styled.div`
  flex: 1;
  border-bottom: 1px solid var(--background-700);
`;

export const BottomLineButtonWrapper = styled.div`
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
`;

export const BottomLineButton = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 5px;

  &:hover {
    background: var(--background-700);
  }
`;

export const BottomLineButtonLabel = styled.div`
  padding: 0 10px;
`;

export const BottomLineIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BottomLineIcon = styled.figure`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  > svg {
    width: 12.5px;
    fill: var(--primary-400);
  }
`;

export const BottomLineTextWrapper = styled.div`
  margin-right: 5px;
`;

export const BottomLineText = styled.p`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-400);
`;
