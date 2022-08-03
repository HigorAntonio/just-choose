import styled, { css } from 'styled-components';

import JustChooseLogoLight from '../../assets/JustChooseLogoLight.svg';
import JustChooseLogoDark from '../../assets/JustChooseLogoDark.svg';

export const Logo = styled.img.attrs((props) => ({
  src:
    props.src ||
    (props.theme === 'light' ? JustChooseLogoLight : JustChooseLogoDark),
  alt: props.alt || 'JustChose Logo',
}))`
  height: 3.5rem;
  margin-left: 1rem;

  &:hover {
    cursor: pointer;
  }
`;

export const Container = styled.div`
  width: 42rem;
  max-width: 90vw;
  max-height: 90%;
  background: var(--background-100);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem;
  z-index: 500;
`;

export const ModalHeader = styled.div``;

const NavActiveCSS = css`
  color: var(--primary-400);
  border-bottom: 0.2rem solid var(--primary-400);
`;

export const Nav = styled.div`
  width: 100%;
  display: flex;
  align-self: flex-start;
  margin-top: 1rem;
  border-bottom: 0.1rem solid var(--background-500);
`;

export const SignIn = styled.button`
  padding: 1rem 0 0.5rem 0;
  margin-right: 1rem;
  font-size: 1.4rem;
  font-weight: bold;
  border-bottom: 0.2rem solid transparent;
  cursor: pointer;
  outline: none;

  &.active {
    ${NavActiveCSS}
  }
`;

export const SignUp = styled.button`
  padding: 1rem 0 0.5rem 0;
  margin: 0 1rem;
  font-size: 1.4rem;
  font-weight: bold;
  border-bottom: 0.2rem solid transparent;
  cursor: pointer;
  outline: none;

  &.active {
    ${NavActiveCSS}
  }
`;

export const FormWrapper = styled.div`
  width: 100%;
  font-size: 1.4rem;
  margin-bottom: 2rem;
`;

export const InputWithLabel = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2.5rem 0;
`;

export const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

export const Input = styled.input`
  width: 100%;
  background: var(--background-500);
  padding: 0.5rem 1rem;
  border: 0.2rem solid var(--background-500);
  border-radius: 5px;
  outline: none;

  &:hover {
    border: 0.2rem solid var(--background-900);
  }
  &:focus {
    border: 0.2rem solid var(--primary-400);
  }

  transition: border 0.3s;
`;

export const SignFormButton = styled.button`
  margin-top: 2rem;
  width: 100%;
  padding: 0.7rem;
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
  margin: 2.5rem 0;
  padding: 1rem;
  border-radius: 5px;
  background: var(--error);

  > p {
    color: var(--white);
    text-align: center;
    font-weight: bold;
  }

  > p + p {
    margin-top: 0.5rem;
  }
`;
