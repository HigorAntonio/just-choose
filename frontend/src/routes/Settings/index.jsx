import React, { useState, useEffect, useRef } from 'react';

import {
  Container,
  Header,
  Navigation,
  Main,
  LayoutBox,
  ThumbnailWrapper,
  ThumbPreview,
} from './styles';

const Settings = ({ wrapperRef }) => {
  const [navOption, setNavOption] = useState('profile');
  const [profileImage, setProfileImage] = useState();
  const [profileImagePreview, setProfileImagePreview] = useState();
  const [profileImageError, setProfileImageError] = useState('');

  const profileImageInputFileRef = useRef();

  useEffect(() => {
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  }, [wrapperRef]);

  const handleProfileImage = (e) => {
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
    }
  };

  return (
    <Container>
      <Header>
        <h1>Configurações</h1>
      </Header>
      <Navigation>
        <div
          className={navOption === 'profile' ? 'active' : ''}
          onClick={() => setNavOption('profile')}
        >
          <p>Perfil</p>
        </div>
        <div
          className={navOption === 'security' ? 'active' : ''}
          onClick={() => setNavOption('security')}
        >
          <p>Segurança e privacidade</p>
        </div>
        <div
          className={navOption === 'devices' ? 'active' : ''}
          onClick={() => setNavOption('devices')}
        >
          <p>Seus dispositivos</p>
        </div>
      </Navigation>
      <Main>
        {navOption === 'profile' && (
          <>
            <h3>Imagem de perfil</h3>
            <LayoutBox>
              <ThumbnailWrapper>
                <div className="column">
                  <ThumbPreview src={profileImagePreview} className="rounded" />
                </div>
                <div className="column button-wrapper">
                  <div className="file-input">
                    <label htmlFor="thumbnail">Selecione uma imagem</label>
                    <input
                      type="file"
                      id="thumbnail"
                      accept="image/*"
                      onChange={handleProfileImage}
                      ref={profileImageInputFileRef}
                    />
                  </div>
                  <p>
                    A imagem deve estar no formato JPEG, PNG ou GIF e não pode
                    ter mais do que 2 MB.
                  </p>
                  {profileImageError && (
                    <p className="thumb-error">{profileImageError}</p>
                  )}
                </div>
              </ThumbnailWrapper>
            </LayoutBox>
          </>
        )}
        {navOption === 'security' && (
          <>
            <h3>Segurança</h3>
          </>
        )}
      </Main>
    </Container>
  );
};

export default Settings;
