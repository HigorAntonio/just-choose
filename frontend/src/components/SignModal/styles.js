import styled, { css } from 'styled-components';

import JustChooseLogoLight from '../../assets/JustChooseLogoLight.svg';
import JustChooseLogoDark from '../../assets/JustChooseLogoDark.svg';

export const Logo = styled.img.attrs((props) => ({
  src:
    props.src ||
    (props.theme === 'light' ? JustChooseLogoLight : JustChooseLogoDark),
  alt: props.alt || 'JustChose Logo',
}))`
  height: 35px;
  margin-left: 10px;

  &:hover {
    cursor: pointer;
  }
`;

export const Container = styled.div`
  width: 420px;
  max-width: 90vw;
  max-height: 90%;
  background: var(--background-100);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  z-index: 500;
`;

export const ModalHeader = styled.div``;

const NavActiveCSS = css`
  color: var(--primary-400);
  border-bottom: 2px solid var(--primary-400);
`;

export const Nav = styled.div`
  width: 100%;
  display: flex;
  align-self: flex-start;
  margin-top: 10px;
  border-bottom: 1px solid var(--background-500);
`;

export const SignIn = styled.button`
  padding: 10px 0 5px 0;
  margin-right: 10px;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  outline: none;

  &.active {
    ${NavActiveCSS}
  }
`;

export const SignUp = styled.button`
  padding: 10px 0 5px 0;
  margin: 0 10px;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  outline: none;

  &.active {
    ${NavActiveCSS}
  }
`;

export const FormWrapper = styled.div`
  width: 100%;
  font-size: 14px;
  margin-bottom: 20px;
`;

export const InputWithLabel = styled.div`
  display: flex;
  flex-direction: column;
  margin: 25px 0;
`;

export const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

export const Input = styled.input`
  width: 100%;
  background: var(--background-500);
  padding: 5px 10px;
  border: 2px solid var(--background-500);
  border-radius: 5px;
  outline: none;

  &:hover {
    border: 2px solid var(--background-900);
  }
  &:focus {
    border: 2px solid var(--primary-400);
  }

  transition: border 0.3s;
`;

export const SignFormButton = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 7px;
  border-radius: 5px;
  color: var(--white);
  background: var(--primary-400);
  outline: none;
  font-weight: bold;

  &:hover {
    cursor: pointer;
    background: var(--primary-500);
  }

  &:disabled {
    cursor: not-allowed;
    background: var(--background-300);
    color: var(--dark-gray);
  }
`;

export const SignInForm = styled.form``;

export const SignUpForm = styled.form``;

export const FormErrors = styled.div`
  margin: 25px 0;
  padding: 10px;
  border-radius: 5px;
  background: var(--error);

  > p {
    color: var(--white);
    text-align: center;
    font-weight: bold;
  }

  > p + p {
    margin-top: 5px;
  }
`;
