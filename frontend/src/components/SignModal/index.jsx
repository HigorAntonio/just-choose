import React from 'react';

import {
  ModalWrapper,
  ModalContent,
  ModalHeader,
  Logo,
  ModalNav,
  ModalSignIn,
  ModalSignUp,
  FormWrapper,
  SignInForm,
  SignUpForm,
  CloseModal,
} from './styles';

const SignModal = ({ show, setShow, navOption, setNavOption }) => {
  if (!show) return null;
  return (
    <ModalWrapper onClick={() => setShow(false)}>
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
              <div>
                <label htmlFor="username">Usuário</label>
                <input type="text" id="username" autoFocus />
              </div>
              <div>
                <label htmlFor="password">Senha</label>
                <input type="password" id="password" />
              </div>
              <button type="submit">Entrar</button>
            </SignInForm>
          ) : (
            <SignUpForm>
              <div>
                <label htmlFor="username">Usuário</label>
                <input type="text" id="username" autoFocus />
              </div>
              <div>
                <label htmlFor="password">Senha</label>
                <input type="password" id="password" />
              </div>
              <div>
                <label htmlFor="passwordConfirm">Confirmação de senha</label>
                <input type="password" id="passwordConfirm" />
              </div>
              <div>
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" />
              </div>
              <button type="submit">Cadastrar-se</button>
            </SignUpForm>
          )}
        </FormWrapper>
        <CloseModal onClick={() => setShow(false)}>&#x2715;</CloseModal>
      </ModalContent>
    </ModalWrapper>
  );
};

export default SignModal;
