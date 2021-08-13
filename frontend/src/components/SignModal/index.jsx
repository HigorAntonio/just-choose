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
        const errors = error.response.data.erros
          ? error.response.data.erros
          : [error.response.data.erro];
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
        const errors = error.response.data.erros
          ? error.response.data.erros
          : [error.response.data.erro];
        if (errors) {
          setSignInErrors([...errors]);
        }
      }
    }
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

  const signUpFormValidation = () => {
    return (
      !signUpName ||
      !signUpPassword ||
      signUpPassword !== signUpConfirmPassword ||
      !signUpEmail
    );
  };

  const signInFormValidation = () => {
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
                  <p key={`sife${i}`}>{err}</p>
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
              disabled={signInFormValidation()}
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
                  <p key={`sife${i}`}>{err}</p>
                ))}
              </FormErrors>
            )}
            <InputWithLabel>
              <Label htmlFor="username">Usuário</Label>
              <Input
                type="text"
                id="username"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                autoFocus
              />
            </InputWithLabel>
            <InputWithLabel>
              <InputToggleVisibility
                label="Senha"
                id="password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
              />
            </InputWithLabel>
            <InputWithLabel>
              <InputToggleVisibility
                label="Confirmação de senha"
                id="passwordConfirm"
                value={signUpConfirmPassword}
                onChange={(e) => setSignUpConfirmPassword(e.target.value)}
              />
            </InputWithLabel>
            <InputWithLabel>
              <Label htmlFor="email">E-mail</Label>
              <Input
                type="email"
                id="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
              />
            </InputWithLabel>
            <SignFormButton
              type="submit"
              disabled={signUpFormValidation()}
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
