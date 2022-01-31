import styled from 'styled-components';

import JustChooseLogo from '../../../assets/JustChooseLogo.svg';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px;
  padding-top: 90px;

  > h3 {
    font-size: 2.4rem;
    margin-bottom: 10px;
    text-align: center;
  }

  > p {
    font-size: 1.8rem;
    text-align: center;
  }
`;

export const Logo = styled.img.attrs((props) => ({
  src: JustChooseLogo,
  alt: 'JustChoose Logo',
}))`
  height: 135px;
  margin-bottom: 20px;
`;
