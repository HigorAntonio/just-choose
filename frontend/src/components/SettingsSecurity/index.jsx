import React, { useState, useContext } from 'react';

import { ProfileContext } from '../../context/ProfileContext';

import InputToggle from '../InputToggle';

import {
  Container,
  LayoutBox,
  InputWrapper,
  LabelWrapper,
  ButtonWrapper,
  ChangePasswordButton,
  Email,
  EmailStatus,
  ResendEmailButton,
} from './styles';

const SettingsSecurity = ({ wrapperRef }) => {
  const { userProfile } = useContext(ProfileContext);

  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [passwordChange, setPasswordChange] = useState(false);

  const handleUpdatePassword = () => {};

  return (
    <Container>
      <h3>Contato</h3>
      <LayoutBox>
        <InputWrapper>
          <LabelWrapper>
            <label>E-mail</label>
          </LabelWrapper>
          <div className="column">
            <div className="row">
              <Email>{userProfile.email}</Email>
              {!userProfile.is_active && (
                <ResendEmailButton>Reenviar e-mail</ResendEmailButton>
              )}
            </div>
            <EmailStatus>
              {userProfile.is_active ? (
                <span>Verificado.</span>
              ) : (
                <span>Não verificado.</span>
              )}
              &nbsp;
              {userProfile.is_active
                ? `Agradecemos por verificar o seu e-mail.`
                : `Verifique sua caixa de entrada.`}
            </EmailStatus>
          </div>
        </InputWrapper>
      </LayoutBox>
      <h3>Segurança</h3>
      <LayoutBox>
        <InputWrapper>
          <LabelWrapper>
            <label>Senha</label>
          </LabelWrapper>
          <div className="column">
            <span>
              <button
                onClick={() =>
                  setShowChangePasswordForm((prevState) => !prevState)
                }
              >
                Altere sua senha.
              </button>
              <p>&nbsp;Aumente sua segurança com uma senha forte.</p>
            </span>
          </div>
        </InputWrapper>
        {showChangePasswordForm && (
          <>
            <InputWrapper>
              <LabelWrapper>
                <label htmlFor="old-password">Senha Atual</label>
              </LabelWrapper>
              <div className="column">
                <InputToggle id="old-password"></InputToggle>
              </div>
            </InputWrapper>
            <InputWrapper>
              <LabelWrapper>
                <label htmlFor="new-password">Nova Senha</label>
              </LabelWrapper>
              <div className="column">
                <InputToggle id="new-password"></InputToggle>
              </div>
            </InputWrapper>
            <InputWrapper>
              <LabelWrapper>
                <label htmlFor="confirm-password">Confirmar Nova Senha</label>
              </LabelWrapper>
              <div className="column">
                <InputToggle id="confirm-password"></InputToggle>
              </div>
            </InputWrapper>
            <ButtonWrapper>
              <ChangePasswordButton
                disabled={!passwordChange}
                onClick={handleUpdatePassword}
              >
                Salvar alterações
              </ChangePasswordButton>
            </ButtonWrapper>
          </>
        )}
      </LayoutBox>
    </Container>
  );
};

export default SettingsSecurity;
