import React, { useState, useContext, useEffect } from 'react';

import { AlertContext } from '../../context/AlertContext';
import { ProfileContext } from '../../context/ProfileContext';

import justChooseApi from '../../apis/justChooseApi';
import InputToggle from '../InputToggle';

import {
  Container,
  LayoutBox,
  InputWrapper,
  LabelWrapper,
  ButtonWrapper,
  ChangePasswordButton,
  EmailWrapper,
  Email,
  EmailStatus,
  ResendEmailButton,
} from './styles';

const SettingsSecurity = ({ wrapperRef }) => {
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);
  const { userProfile } = useContext(ProfileContext);

  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [resendingConfirmationEmail, setResendingConfirmationEmail] =
    useState(false);
  const [errorOnResendConfirmationEmail, setErrorOnResendConfirmationEmail] =
    useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [errorOnUpdatePassword, setErrorOnUpdatePassword] = useState(false);

  useEffect(() => {
    if (resendingConfirmationEmail) {
      setSeverity('info');
      setMessage('Por favor, aguarde. Solicitando reenvio do e-mail...');
    } else if (errorOnResendConfirmationEmail) {
      setSeverity('error');
      setMessage(
        'Não foi possível solicitar o reenvio do e-mail. Por favor, tente novamente.'
      );
    } else {
      setSeverity('success');
      setMessage('Reenvio do e-mail solicitado com sucesso.');
    }
  }, [
    resendingConfirmationEmail,
    errorOnResendConfirmationEmail,
    setMessage,
    setSeverity,
  ]);

  useEffect(() => {
    if (updatingPassword) {
      setSeverity('info');
      setMessage('Por favor, aguarde. Alterando senha...');
    } else if (errorOnUpdatePassword) {
      setSeverity('error');
      setMessage(
        'Não foi possível alterar a senha. Por favor, tente novamente.'
      );
    } else {
      setSeverity('success');
      setMessage('Senha alterada com sucesso.');
    }
  }, [updatingPassword, errorOnUpdatePassword, setMessage, setSeverity]);

  const clearUpdatePasswordForm = () => {
    setShowChangePasswordForm(false);
    setCurrentPassword('');
    setCurrentPasswordError('');
    setNewPassword('');
    setNewPasswordError('');
    setConfirmPassword('');
    setConfirmPasswordError('');
  };

  const validateNewPassword = (newPassword) => {
    setNewPasswordError('');
    if (newPassword.length < 8) {
      setNewPasswordError('A senha deve ter no mínimo 8 caracteres.');
    }
  };

  const validateConfirmPassword = (newPassword, confirmPassword) => {
    setConfirmPasswordError('');
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError('As senhas não conferem. Tente outra vez.');
    }
  };

  const handleCurrentPasswordInput = (e) => {
    setCurrentPassword(e.target.value);
    setCurrentPasswordError('');
  };

  const handleNewPasswordInput = (e) => {
    setNewPassword(e.target.value);
    validateNewPassword(e.target.value);
    if (confirmPassword !== '') {
      validateConfirmPassword(e.target.value, confirmPassword);
    }
  };

  const handleConfirmPasswordInput = (e) => {
    setConfirmPassword(e.target.value);
    validateConfirmPassword(newPassword, e.target.value);
  };

  const handleResendConfirmationEmail = async () => {
    setErrorOnResendConfirmationEmail(false);
    setShowAlert(true);
    setResendingConfirmationEmail(true);
    clearTimeout(alertTimeout);

    try {
      await justChooseApi.get('/confirmation');
    } catch (error) {
      setErrorOnResendConfirmationEmail(true);
    }

    setResendingConfirmationEmail(false);
    setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
  };

  const handleUpdatePassword = async () => {
    setErrorOnUpdatePassword(false);
    setShowAlert(true);
    setUpdatingPassword(true);
    clearTimeout(alertTimeout);

    let successfulyUpdated = true;
    try {
      await justChooseApi({
        url: `/updatepassword`,
        method: 'PUT',
        data: { currentPassword, newPassword },
      });
    } catch (error) {
      setErrorOnUpdatePassword(true);
      successfulyUpdated = false;

      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.erro === 'Senha inválida'
      ) {
        setCurrentPasswordError('Senha inválida.');
      }
    }

    setUpdatingPassword(false);
    setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    if (successfulyUpdated) {
      clearUpdatePasswordForm();
    }
  };

  const isDisabledChangePasswordButton = () => {
    return (
      currentPassword === '' ||
      currentPasswordError !== '' ||
      newPassword === '' ||
      newPasswordError !== '' ||
      confirmPassword === '' ||
      confirmPasswordError !== ''
    );
  };

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
              <EmailWrapper>
                <Email>{userProfile.email}</Email>
              </EmailWrapper>
              {!userProfile.is_active && (
                <ResendEmailButton
                  disabled={resendingConfirmationEmail}
                  onClick={handleResendConfirmationEmail}
                >
                  Reenviar e-mail
                </ResendEmailButton>
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
                <InputToggle
                  id="old-password"
                  value={currentPassword}
                  onChange={handleCurrentPasswordInput}
                />
                {currentPasswordError && (
                  <p className="error">{currentPasswordError}</p>
                )}
              </div>
            </InputWrapper>
            <InputWrapper>
              <LabelWrapper>
                <label htmlFor="new-password">Nova Senha</label>
              </LabelWrapper>
              <div className="column">
                <InputToggle
                  id="new-password"
                  value={newPassword}
                  onChange={handleNewPasswordInput}
                />
                {newPasswordError && (
                  <p className="error">{newPasswordError}</p>
                )}
              </div>
            </InputWrapper>
            <InputWrapper>
              <LabelWrapper>
                <label htmlFor="confirm-password">Confirmar Nova Senha</label>
              </LabelWrapper>
              <div className="column">
                <InputToggle
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordInput}
                />
                {confirmPasswordError && (
                  <p className="error">{confirmPasswordError}</p>
                )}
              </div>
            </InputWrapper>
            <ButtonWrapper>
              <ChangePasswordButton
                disabled={isDisabledChangePasswordButton()}
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
