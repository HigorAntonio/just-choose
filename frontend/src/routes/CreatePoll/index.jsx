import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

import NotFound from '../../components/NotFound';
import AccessDenied from '../../components/AccessDenied';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import ContentCardSimple from '../../components/ContentCardSimple';
import justChooseApi from '../../apis/justChooseApi';

import mUILightTheme from '../../styles/materialUIThemes/light';
import mUIDarkTheme from '../../styles/materialUIThemes/dark';

import {
  Container,
  Header,
  Main,
  LabelWrapper,
  InputWrapper,
  TitleInput,
  ThumbnailWrapper,
  ThumbPreview,
  ContentListContainer,
  Options,
  Option,
  SharingOption,
  ContentListWrapper,
  CreationOptions,
  CreateButton,
  ContentList,
} from './styles';

const getSharingOption = (type) => {
  switch (type) {
    case 'private':
      return 'Privada';
    case 'public':
      return 'Pública';
    case 'followed_profiles':
      return 'Perfis seguidos';
    default:
      return '';
  }
};

const getContentBaseUrl = (type) => {
  switch (type) {
    case 'movie':
      return process.env.REACT_APP_TMDB_MOVIE_URL;
    case 'show':
      return process.env.REACT_APP_TMDB_SHOW_URL;
    case 'game':
      return process.env.REACT_APP_RAWG_GAME_URL;
    default:
      return '';
  }
};

const CreatePoll = ({ wrapperRef }) => {
  const { id: listId } = useParams();
  const history = useHistory();

  const { userId } = useContext(AuthContext);
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);
  const { title: theme } = useContext(ThemeContext);

  const [loadingError, setLoadingError] = useState(false);
  const [denyAccess, setDenyAccess] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sharingOption, setSharingOption] = useState('');
  const [showSharingOption, setShowSharingOption] = useState(false);
  const [sharingOptionError, setSharingOptionError] = useState(false);
  const [thumbnail, setThumbnail] = useState();
  const [thumbPreview, setThumbPreview] = useState();
  const [thumbError, setThumbError] = useState('');
  const [contentList, setContentList] = useState([]);
  const [creating, setCreating] = useState(false);
  const [errorOnCreate, setErrorOnCreate] = useState(false);
  const [titleError, setTitleError] = useState('');

  const contentListWrapperRef = useRef();
  const thumbInputFileRef = useRef();

  useEffect(() => {
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
    contentListWrapperRef.current.scrollTop = 0;
    contentListWrapperRef.current.scrollLeft = 0;
  }, [wrapperRef]);

  useEffect(() => {
    (async () => {
      try {
        clearForm();
        const { data } = await justChooseApi.get(`/contentlists/${listId}`);
        if (userId !== data.user_id) {
          setDenyAccess(true);
          return;
        }
        let content = [];
        Object.keys(data.content).map(
          (key) => (content = [...content, ...data.content[key]])
        );
        setContentList(content);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setLoadingError(true);
        }
        if (error.response && error.response.status === 403) {
          setDenyAccess(true);
        }
      }
    })();
  }, [listId, userId]);

  useEffect(() => {
    if (creating) {
      setSeverity('info');
      setMessage('Por favor, aguarde. Criando votação...');
    } else if (errorOnCreate) {
      setSeverity('error');
      setMessage(
        'Não foi possível criar a votação. Por favor, tente novamente.'
      );
    } else {
      setSeverity('success');
      setMessage('Votação criada com sucesso.');
    }
  }, [creating, errorOnCreate, setMessage, setSeverity]);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setSharingOption('');
    setThumbnail(null);
    setThumbPreview(null);
    thumbInputFileRef.current.value = null;
    setContentList([]);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
    setTitleError('');
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleImage = (e) => {
    setThumbError('');
    if (e.target.files[0].size > 2097152) {
      setThumbError('A imagem não pode ter mais do que 2 MB.');
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setThumbPreview(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
      setThumbnail(e.target.files[0]);
    }
  };

  const validateFields = () => {
    setTitleError('');
    setSharingOptionError('');
    setThumbError('');
    let isValid = true;
    if (!title) {
      setTitleError('Por favor, insira um título para a votação');
      isValid = false;
    }
    if (!sharingOption) {
      setSharingOptionError(
        'Por favor, selecione uma opção de compartilhamento para a votação'
      );
    }
    if (!thumbnail) {
      setThumbError('Por favor, selecione uma miniatura para a votação');
      isValid = false;
    }

    return isValid;
  };

  const handleCreatePoll = async () => {
    setErrorOnCreate(false);
    setShowAlert(true);
    setCreating(true);
    clearTimeout(alertTimeout);

    const isValid = validateFields();
    if (isValid) {
      const data = {
        title,
        description,
        sharingOption,
        contentListId: listId,
      };

      const formData = new FormData();
      formData.append('thumbnail', thumbnail);
      formData.append('data', JSON.stringify(data));
      try {
        await justChooseApi({
          url: '/polls',
          method: 'POST',
          data: formData,
        });
      } catch (error) {
        setErrorOnCreate(true);
      }
    } else {
      setErrorOnCreate(true);
    }

    setCreating(false);
    setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  };

  if (loadingError) {
    return <NotFound />;
  }
  if (denyAccess) {
    return <AccessDenied />;
  }
  return (
    <Container>
      <Header>
        <h1>Nova Votação</h1>
      </Header>
      <Main>
        <h3>Principal</h3>
        <div>
          <InputWrapper>
            <LabelWrapper>
              <label htmlFor="title">Título</label>
            </LabelWrapper>
            <div className="column">
              <TitleInput
                type="text"
                id="title"
                autoFocus
                value={title}
                onChange={handleTitle}
                validationError={titleError}
              />
              {titleError && <p className="error">{titleError}</p>}
            </div>
          </InputWrapper>
          <InputWrapper>
            <LabelWrapper>
              <label htmlFor="description">Descrição</label>
            </LabelWrapper>
            <textarea
              id="description"
              cols="30"
              rows="10"
              value={description}
              onChange={handleDescription}
            ></textarea>
          </InputWrapper>
          <InputWrapper>
            <LabelWrapper>
              <label htmlFor="sharing-option">Opção de compartilhamento</label>
            </LabelWrapper>
            <div className="column">
              <SingleOptionSelect
                label={
                  !sharingOption
                    ? 'Selecionar'
                    : getSharingOption(sharingOption)
                }
                dropDownAlign="left"
                show={showSharingOption}
                setShow={setShowSharingOption}
                width="150px"
              >
                <Options>
                  <Option
                    onClick={() => {
                      setSharingOption('public');
                      setSharingOptionError(false);
                      setShowSharingOption(false);
                    }}
                  >
                    <SharingOption>
                      <div>Pública</div>
                      <div>Todos podem pesquisar e ver</div>
                    </SharingOption>
                  </Option>
                  <Option
                    onClick={() => {
                      setSharingOption('followed_profiles');
                      setSharingOptionError(false);
                      setShowSharingOption(false);
                    }}
                  >
                    <SharingOption>
                      <div>Perfis seguidos</div>
                      <div>Apenas perfis seguidos podem pesquisar e ver</div>
                    </SharingOption>
                  </Option>
                  <Option
                    onClick={() => {
                      setSharingOption('private');
                      setSharingOptionError(false);
                      setShowSharingOption(false);
                    }}
                  >
                    <SharingOption>
                      <div>Privada</div>
                      <div>Só você pode ver</div>
                    </SharingOption>
                  </Option>
                </Options>
              </SingleOptionSelect>
              {sharingOptionError && (
                <p className="error">{sharingOptionError}</p>
              )}
            </div>
          </InputWrapper>
        </div>
        <h3>Miniatura</h3>
        <div>
          <ThumbnailWrapper>
            <div className="column">
              <ThumbPreview src={thumbPreview} />
            </div>
            <div className="column">
              <div className="file-input">
                <label htmlFor="thumbnail">Selecione uma imagem</label>
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleImage}
                  ref={thumbInputFileRef}
                />
              </div>
              <p>
                A imagem deve estar no formato JPEG, PNG ou GIF e não pode ter
                mais do que 2 MB.
              </p>
              {thumbError && <p className="thumb-error">{thumbError}</p>}
            </div>
          </ThumbnailWrapper>
        </div>
        <h3>Conteúdo</h3>
        <div className="content-list">
          <ContentListContainer>
            <ContentListWrapper ref={contentListWrapperRef}>
              <ContentList>
                {contentList.length > 0 &&
                  contentList.map((c, i) => {
                    const src =
                      c.type === 'game'
                        ? c.poster_path
                        : `${process.env.REACT_APP_TMDB_POSTER_URL}w185${c.poster_path}`;
                    const href = `${getContentBaseUrl(c.type)}/${
                      c.content_platform_id
                    }`;
                    return (
                      <div key={c.type + c.content_id} className="cardWrapper">
                        <a href={href} target="blank">
                          <ContentCardSimple src={src} title={c.title} />
                        </a>
                      </div>
                    );
                  })}
                {contentList.length <= 0 &&
                  [...Array(30).keys()].map((c) => (
                    <div key={c} className="cardWrapper">
                      <ThemeProvider
                        theme={theme === 'light' ? mUILightTheme : mUIDarkTheme}
                      >
                        <Skeleton
                          variant="rect"
                          width={'100%'}
                          height={'100%'}
                        />
                      </ThemeProvider>
                    </div>
                  ))}
              </ContentList>
            </ContentListWrapper>
          </ContentListContainer>
          <CreationOptions>
            <div>
              <CreateButton onClick={handleCreatePoll} disabled={creating}>
                Criar Votação
              </CreateButton>
            </div>
          </CreationOptions>
        </div>
      </Main>
    </Container>
  );
};

export default CreatePoll;
