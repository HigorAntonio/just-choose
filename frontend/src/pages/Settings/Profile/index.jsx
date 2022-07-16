import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';

import { LayoutContext } from '../../../context/LayoutContext';
import { AlertContext } from '../../../context/AlertContext';
import { ProfileContext } from '../../../context/ProfileContext';

import justChooseApi from '../../../services/justChooseApi';

import {
  Container,
  LayoutBox,
  ThumbnailWrapper,
  ThumbPreview,
  InputWrapper,
  LabelWrapper,
  NameInput,
  ButtonWrapper,
  ProfileButton,
} from './styles';

const Profile = () => {
  const { contentWrapperRef } = useContext(LayoutContext);
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);
  const { profile, refreshProfileData } = useContext(ProfileContext);

  const [profileImagePreview, setProfileImagePreview] = useState();
  const [profileImage, setProfileImage] = useState();
  const [profileImageError, setProfileImageError] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileNameError, setProfileNameError] = useState('');
  const [profileSettingsChange, setProfileSettingsChange] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errorOnUpdate, setErrorOnUpdate] = useState(false);
  const [updatedSuccessfully, setUpdatedSuccessfully] = useState(false);

  const profileImageInputFileRef = useRef();
  const mounted = useRef();

  const setInitialFormData = useCallback(() => {
    profile.profile_image_url &&
      setProfileImagePreview(profile.profile_image_url);
    profile.name && setProfileName(profile.name);
    setProfileSettingsChange(false);
  }, [profile]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setInitialFormData();
  }, [setInitialFormData]);

  useEffect(() => {
    if (updating) {
      setSeverity('info');
      setMessage('Por favor, aguarde. Atualizando dados do perfil...');
    } else if (errorOnUpdate) {
      setSeverity('error');
      setMessage(
        'Não foi possível atualizar os dados do perfil. Por favor, tente novamente.'
      );
    } else if (updatedSuccessfully) {
      setSeverity('success');
      setMessage('Dados do perfil atualizados com sucesso.');
    }
  }, [updating, errorOnUpdate, updatedSuccessfully, setMessage, setSeverity]);

  const handleProfileImageInput = (e) => {
    setProfileImageError('');
    if (e.target.files[0].size > 2097152) {
      setProfileImageError('A imagem não pode ter mais do que 2 MB.');
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setProfileImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
      setProfileImage(e.target.files[0]);
      setProfileSettingsChange(true);
    }
  };

  const handleProfileImage = () => {
    profileImageInputFileRef.current.click();
  };

  const handleProfileImageKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleProfileImage();
    }
  };

  const validateProfileName = (profileName) => {
    setProfileNameError('');
    if (profileName.length < 4 || profileName.length > 25) {
      setProfileNameError(
        'Os nomes de usuário devem ter entre 4 e 25 caracteres.'
      );
    }
  };

  const handleProfileName = (e) => {
    setProfileName(e.target.value);
    validateProfileName(e.target.value);
    setProfileSettingsChange(true);
  };

  const handleUpdateProfile = async () => {
    setErrorOnUpdate(false);
    setUpdatedSuccessfully(false);
    setShowAlert(true);
    setUpdating(true);
    clearTimeout(alertTimeout);

    let successfulyUpdated = true;
    const data = {};
    if (profileName !== profile.name) {
      data.name = profileName;
    }

    const formData = new FormData();
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }
    formData.append('data', JSON.stringify(data));
    try {
      await justChooseApi({
        url: `/profiles`,
        method: 'PUT',
        data: formData,
      });
    } catch (error) {
      if (mounted.current) {
        setErrorOnUpdate(true);
      }
      successfulyUpdated = false;

      if (
        mounted.current &&
        error.response &&
        error.response.status === 400 &&
        error.response.data.erro === 'Nome de usuário indisponível'
      ) {
        setProfileNameError('Nome de usuário indisponível');
      }
    }

    if (mounted.current) {
      setUpdating(false);
    }
    setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    if (successfulyUpdated) {
      if (mounted.current) {
        setUpdatedSuccessfully(true);
      }
      refreshProfileData();
    }
    contentWrapperRef.current.scrollTo(0, 0);
  };

  const isDisabledUpdateProfileButton = () => {
    return (
      !profileSettingsChange ||
      profileName.length < 4 ||
      profileName.length > 25
    );
  };

  return (
    <Container>
      <h3>Imagem de perfil</h3>
      <LayoutBox>
        <ThumbnailWrapper>
          <div className="column">
            <ThumbPreview src={profileImagePreview} className="rounded" />
          </div>
          <div className="column button-wrapper">
            <div className="file-input">
              <label
                htmlFor="thumbnail"
                onKeyPress={handleProfileImageKeyPress}
                tabIndex="0"
              >
                Selecione uma imagem
              </label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleProfileImageInput}
                ref={profileImageInputFileRef}
              />
            </div>
            <p>
              A imagem deve estar no formato JPEG, PNG ou GIF e não pode ter
              mais do que 2 MB.
            </p>
            {profileImageError && (
              <p className="thumb-error">{profileImageError}</p>
            )}
          </div>
        </ThumbnailWrapper>
      </LayoutBox>
      <h3>Configurações de perfil</h3>
      <LayoutBox>
        <InputWrapper>
          <LabelWrapper>
            <label htmlFor="name">Usuário</label>
          </LabelWrapper>
          <div className="column">
            <NameInput
              spellCheck={false}
              type="text"
              id="name"
              value={profileName}
              onChange={handleProfileName}
              validationError={profileNameError}
            />
            {profileNameError && <p className="error">{profileNameError}</p>}
          </div>
        </InputWrapper>
        <ButtonWrapper>
          <ProfileButton
            disabled={isDisabledUpdateProfileButton()}
            onClick={handleUpdateProfile}
          >
            Salvar alterações
          </ProfileButton>
        </ButtonWrapper>
      </LayoutBox>
    </Container>
  );
};

export default Profile;
