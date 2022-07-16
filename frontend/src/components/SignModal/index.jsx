import React, { useContext, useState } from 'react';
import { ThemeContext } from 'styled-components';

import InputToggleVisibility from '../InputToggleVisibility';

import { AuthContext } from '../../context/AuthContext';

import {
  Container,
  ModalHeader,
  Logo,
  Nav,
  SignIn,
  SignUp,
  FormWrapper,
  InputWithLabel,
  Label,
  Input,
  SignFormButton,
  SignInForm,
  SignUpForm,
  FormErrors,
} from './styles';

const SignModal = ({ setShow, navOption, setNavOption }) => {
  const { title: theme } = useContext(ThemeContext);
  const { handleRegistration, handleLogin } = useContext(AuthContext);

  const [signUpName, setSignUpName] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpErrors, setSignUpErrors] = useState([]);
  const [signInErrors, setSignInErrors] = useState([]);

  const validateSignUpName = (signUpName) => {
    setSignUpErrors((prevState) =>
      prevState.filter(
        (error) =>
          error !== 'Os nomes de usuário devem ter entre 4 e 25 caracteres.' &&
          error !==
            'Nomes de usuário devem conter apenas caracteres alfanuméricos.' &&
          error !== '"name" unavailable'
      )
    );
    if (signUpName.length < 4 || signUpName.length > 25) {
      setSignUpErrors((prevState) => [
        ...prevState,
        'Os nomes de usuário devem ter entre 4 e 25 caracteres.',
      ]);
    } else if (!/^[a-z0-9]+[a-z0-9_]*$/i.test(signUpName)) {
      setSignUpErrors((prevState) => [
        ...prevState,
        'Nomes de usuário devem conter apenas caracteres alfanuméricos.',
      ]);
    }
  };

  const validateSignUpPassword = (password) => {
    setSignUpErrors((prevState) =>
      prevState.filter(
        (error) =>
          error !== 'A senha deve ter no mínimo 8 caracteres.' &&
          error !== 'A senha deve ter no máximo 64 caracteres.'
      )
    );
    if (password.length < 8) {
      setSignUpErrors((prevState) => [
        ...prevState,
        'A senha deve ter no mínimo 8 caracteres.',
      ]);
    } else if (password.length > 64) {
      setSignUpErrors((prevState) => [
        ...prevState,
        'A senha deve ter no máximo 64 caracteres.',
      ]);
    }
  };

  const validateSignUpConfirmPassword = (password, confirmPassword) => {
    setSignUpErrors((prevState) =>
      prevState.filter(
        (error) => error !== 'As senhas não conferem. Tente outra vez.'
      )
    );
    if (confirmPassword !== password) {
      setSignUpErrors((prevState) => [
        ...prevState,
        'As senhas não conferem. Tente outra vez.',
      ]);
    }
  };

  const validateSignUpEmail = (signUpEmail) => {
    setSignUpErrors((prevState) =>
      prevState.filter(
        (error) =>
          error !== 'Informe um email válido.' &&
          error !== '"email" must be a valid email' &&
          error !== '"email" unavailable'
      )
    );
    if (!/\S+@\S+\.\S+/.test(signUpEmail)) {
      setSignUpErrors((prevState) => [
        ...prevState,
        'Informe um email válido.',
      ]);
    }
  };

  const handleSignUpNameInput = (e) => {
    setSignUpName(e.target.value);
    validateSignUpName(e.target.value);
  };

  const handleSignUpPasswordInput = (e) => {
    setSignUpPassword(e.target.value);
    validateSignUpPassword(e.target.value);
    if (signUpConfirmPassword !== '') {
      validateSignUpConfirmPassword(e.target.value, signUpConfirmPassword);
    }
  };

  const handleSignUpConfirmPasswordInput = (e) => {
    setSignUpConfirmPassword(e.target.value);
    validateSignUpConfirmPassword(signUpPassword, e.target.value);
  };

  const handleSignUpEmailInput = (e) => {
    setSignUpEmail(e.target.value);
    validateSignUpEmail(e.target.value);
  };

  const handleSignUp = async (e) => {
    try {
      e.preventDefault();
      await handleRegistration({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
      });
      clearForm();
      setShow(false);
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.messages
          ? error.response.data.messages
          : [error.response.data.message];
        if (errors) {
          setSignUpErrors([...errors]);
        }
      }
    }
  };

  const handleSignIn = async (e) => {
    try {
      e.preventDefault();
      await handleLogin({ email: signInEmail, password: signInPassword });
      clearForm();
      setShow(false);
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.messages
          ? error.response.data.messages
          : [error.response.data.message];
        if (errors) {
          setSignInErrors([...errors]);
        }
      }
    }
  };

  const translateErrorMessage = (errorMessage) => {
    const errorMessages = {
      'profile does not exist': 'Este nome de usuário não existe.',
      '"email" must be a valid email': 'Informe um email válido.',
      'incorrect password': 'A senha estava incorreta. Tente novamente.',
      '"name" unavailable': 'Este nome de usuário está indisponível.',
      '"email" unavailable': 'Este email está indisponível.',
    };
    return errorMessages[errorMessage]
      ? errorMessages[errorMessage]
      : errorMessage;
  };

  const clearForm = () => {
    setSignUpName('');
    setSignUpPassword('');
    setSignUpConfirmPassword('');
    setSignUpEmail('');
    setSignInEmail('');
    setSignInPassword('');
    setSignUpErrors([]);
    setSignInErrors([]);
  };

  const isDisabledSignUpButton = () => {
    return (
      signUpName.length < 4 ||
      signUpName.length > 25 ||
      signUpPassword.length < 8 ||
      signUpPassword !== signUpConfirmPassword ||
      !signUpEmail
    );
  };

  const isDisabledSignInButton = () => {
    return !signInEmail || !signInPassword;
  };

  return (
    <Container>
      <ModalHeader>
        <Logo theme={theme} />
      </ModalHeader>
      <Nav>
        <SignIn
          onClick={() => setNavOption('signIn')}
          className={navOption === 'signIn' ? 'active' : ''}
        >
          Entrar
        </SignIn>
        <SignUp
          onClick={() => setNavOption('signUp')}
          className={navOption === 'signUp' ? 'active' : ''}
        >
          Cadastrar-se
        </SignUp>
      </Nav>
      <FormWrapper>
        {navOption === 'signIn' ? (
          <SignInForm noValidate>
            {signInErrors.length > 0 && (
              <FormErrors>
                {signInErrors.map((err, i) => (
                  <p key={`sife${i}`}>{translateErrorMessage(err)}</p>
                ))}
              </FormErrors>
            )}
            <InputWithLabel>
              <Label htmlFor="email">E-mail</Label>
              <Input
                type="email"
                id="email"
                value={signInEmail}
                onChange={(e) => {
                  setSignInEmail(e.target.value);
                }}
                autoFocus
              />
            </InputWithLabel>
            <InputWithLabel className="password-toggle">
              <InputToggleVisibility
                label="Senha"
                id="password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
              />
            </InputWithLabel>
            <SignFormButton
              type="submit"
              disabled={isDisabledSignInButton()}
              onClick={(e) => handleSignIn(e)}
            >
              Entrar
            </SignFormButton>
          </SignInForm>
        ) : (
          <SignUpForm noValidate>
            {signUpErrors.length > 0 && (
              <FormErrors>
                {signUpErrors.map((err, i) => (
                  <p key={`sufe${i}`}>{translateErrorMessage(err)}</p>
                ))}
              </FormErrors>
            )}
            <InputWithLabel>
              <Label htmlFor="username">Usuário</Label>
              <Input
                type="text"
                id="username"
                value={signUpName}
                onChange={handleSignUpNameInput}
                autoFocus
              />
            </InputWithLabel>
            <InputWithLabel>
              <InputToggleVisibility
                label="Senha"
                id="password"
                value={signUpPassword}
                onChange={handleSignUpPasswordInput}
              />
            </InputWithLabel>
            <InputWithLabel>
              <InputToggleVisibility
                label="Confirmação de senha"
                id="passwordConfirm"
                value={signUpConfirmPassword}
                onChange={handleSignUpConfirmPasswordInput}
              />
            </InputWithLabel>
            <InputWithLabel>
              <Label htmlFor="email">E-mail</Label>
              <Input
                type="email"
                id="email"
                value={signUpEmail}
                onChange={handleSignUpEmailInput}
              />
            </InputWithLabel>
            <SignFormButton
              type="submit"
              disabled={isDisabledSignUpButton()}
              onClick={(e) => handleSignUp(e)}
            >
              Cadastrar-se
            </SignFormButton>
          </SignUpForm>
        )}
      </FormWrapper>
    </Container>
  );
};

export default SignModal;
