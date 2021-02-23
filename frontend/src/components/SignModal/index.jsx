import React, { useContext, useState } from 'react';

import Backdrop from '../Backdrop';
import InputToggleVisibility from '../InputToggleVisibility';

import { AuthContext } from '../../context/AuthContext';

import {
  Container,
  ModalWrapper,
  ModalContent,
  ModalHeader,
  Logo,
  ModalNav,
  ModalSignIn,
  ModalSignUp,
  FormWrapper,
  InputWithLabel,
  Label,
  Input,
  SignFormButton,
  SignInForm,
  SignUpForm,
  CloseModal,
} from './styles';

const SignModal = ({ show, setShow, navOption, setNavOption }) => {
  const { authenticated, handleLogin } = useContext(AuthContext);
  const [signInEmail, setSignInEmail] = useState('');
  const [signPassword, setSignPassword] = useState('');
  console.debug('SignModal', authenticated);

  const handleSignIn = async (e) => {
    try {
      e.preventDefault();
      await handleLogin({ email: signInEmail, password: signPassword });
      setShow(false);
    } catch (error) {}
  };

  if (!show) return null;
  return (
    <Container>
      <ModalWrapper>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <Logo />
          </ModalHeader>
          <ModalNav>
            <ModalSignIn
              onClick={() => setNavOption('signIn')}
              className={navOption === 'signIn' ? 'active' : ''}
            >
              Entrar
            </ModalSignIn>
            <ModalSignUp
              onClick={() => setNavOption('signUp')}
              className={navOption === 'signUp' ? 'active' : ''}
            >
              Cadastrar-se
            </ModalSignUp>
          </ModalNav>
          <FormWrapper>
            {navOption === 'signIn' ? (
              <SignInForm>
                <InputWithLabel>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    type="email"
                    id="email"
                    value={signInEmail}
                    onChange={(e) => {
                      setSignInEmail(e.target.value);
                    }}
                  />
                </InputWithLabel>
                <InputWithLabel className="password-toggle">
                  <InputToggleVisibility
                    label="Senha"
                    id="password"
                    value={signPassword}
                    onChange={(e) => setSignPassword(e.target.value)}
                  />
                </InputWithLabel>
                <SignFormButton type="submit" onClick={(e) => handleSignIn(e)}>
                  Entrar
                </SignFormButton>
              </SignInForm>
            ) : (
              <SignUpForm>
                <InputWithLabel>
                  <Label htmlFor="username">Usuário</Label>
                  <Input type="text" id="username" autoFocus />
                </InputWithLabel>
                <InputWithLabel>
                  <InputToggleVisibility label="Senha" id="password" />
                </InputWithLabel>
                <InputWithLabel>
                  <InputToggleVisibility
                    label="Confirmação de senha"
                    id="passwordConfirm"
                  />
                </InputWithLabel>
                <InputWithLabel>
                  <Label htmlFor="email">E-mail</Label>
                  <Input type="email" id="email" />
                </InputWithLabel>
                <SignFormButton type="submit">Cadastrar-se</SignFormButton>
              </SignUpForm>
            )}
          </FormWrapper>
          <CloseModal onClick={() => setShow(false)}>&#x2715;</CloseModal>
        </ModalContent>
        <Backdrop show={show} clicked={() => setShow(false)} />
      </ModalWrapper>
    </Container>
  );
};

export default SignModal;
