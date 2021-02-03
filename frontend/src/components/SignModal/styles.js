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

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #000000b3;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  width: min(420px, 90%);
  background: var(--primary);
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
`;

export const ModalHeader = styled.div``;

const NavActiveCSS = css`
  border-bottom: 2px solid var(--accent);
`;

export const ModalNav = styled.div`
  width: 100%;
  display: flex;
  align-self: flex-start;
  margin-top: 10px;
  border-bottom: 1px solid var(--search);
`;

export const ModalSignIn = styled.button`
  padding: 10px 0 5px 0;
  margin-right: 10px;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  outline: none;

  &.active {
    ${NavActiveCSS}
  }
`;

export const ModalSignUp = styled.button`
  padding: 10px 0 5px 0;
  margin: 0 10px;
  font-size: 14px;
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

const formCSS = css`
  > div {
    display: flex;
    flex-direction: column;
    margin: 25px 0;
  }

  > div label {
    margin-bottom: 5px;
  }

  > div input {
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
  }

  > button {
    margin-top: 20px;
    width: 100%;
    padding: 7px;
    border-radius: 5px;
    background: var(--accent);
    outline: none;

    &:hover {
      cursor: pointer;
      background: #0f6ba8d9;
    }
  }
`;

export const SignInForm = styled.form`
  ${formCSS}
`;

export const SignUpForm = styled.form`
  ${formCSS}
`;

export const CloseModal = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  position: absolute;
  top: 0;
  right: -35px;
  color: var(--white);
  font-weight: bold;
  font-size: 20px;
  outline: none;

  &:hover {
    background: #ffffff4d;
    cursor: pointer;
  }
`;
