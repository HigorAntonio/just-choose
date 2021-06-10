import styled, { css } from 'styled-components';

import JustChooseLogo from '../../assets/JustChooseLogo.png';

export const Logo = styled.img.attrs((props) => ({
  src: props.src || JustChooseLogo,
  alt: props.alt || 'JustChose Logo',
}))`
  height: 35px;

  &:hover {
    cursor: pointer;
  }
`;

export const Container = styled.div`
  width: 420px;
  max-width: 90vw;
  max-height: 90%;
  background: var(--primary);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  z-index: 500;
`;

export const ModalHeader = styled.div``;

const NavActiveCSS = css`
  border-bottom: 2px solid var(--accent);
`;

export const Nav = styled.div`
  width: 100%;
  display: flex;
  align-self: flex-start;
  margin-top: 10px;
  border-bottom: 1px solid var(--search);
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
  background: var(--search);
  padding: 5px 10px;
  border: 2px solid var(--search);
  border-radius: 5px;
  outline: none;

  &:hover {
    border: 2px solid var(--gray);
  }
  &:focus {
    border: 2px solid var(--accent);
  }

  transition: border 0.3s;
`;

export const SignFormButton = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 7px;
  border-radius: 5px;
  background: var(--accent);
  outline: none;
  font-weight: bold;

  &:hover {
    cursor: pointer;
    background: #0f6ba8d9;
  }

  &:disabled {
    cursor: not-allowed;
    background: rgba(256, 256, 256, 0.08);
    color: #888;
  }
`;

export const SignInForm = styled.form``;

export const SignUpForm = styled.form``;

export const FormErrors = styled.div`
  margin: 25px 0;
  padding: 10px;
  border: 2px solid var(--warning);
  border-radius: 5px;
  background: #ffffff1a;

  > p {
    text-align: center;
    font-weight: bold;
  }

  > p + p {
    margin-top: 5px;
  }
`;
