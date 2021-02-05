import React from 'react';

import Backdrop from '../Backdrop';
import InputToggleVisibility from '../InputToggleVisibility';

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
                  <Label htmlFor="username">Usuário</Label>
                  <Input type="text" id="username" autoFocus />
                </InputWithLabel>
                <InputWithLabel className="password-toggle">
                  <InputToggleVisibility label="Senha" id="password" />
                </InputWithLabel>
                <SignFormButton type="submit">Entrar</SignFormButton>
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
