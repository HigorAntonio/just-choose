import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import { LayoutContext } from '../../context/LayoutContext';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

import NotFound from '../../components/NotFound';
import SomethingWentWrong from '../../components/SomethingWentWrong';
import AccessDenied from '../../components/AccessDenied';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import InfinityLoadContentGrid from '../../components/InfinityLoadContentGrid';
import justChooseApi from '../../services/justChooseApi';
import useLoadMoreWhenLastElementIsOnScreen from '../../hooks/useLoadMoreWhenLastElementIsOnScreen';
import sharingOptions from '../../utils/sharingOptions';

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
} from './styles';

const CreatePoll = () => {
  const { id: listId } = useParams();
  const history = useHistory();

  const { profileId } = useContext(AuthContext);
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);
  const { contentWrapperRef } = useContext(LayoutContext);

  const [loadingError, setLoadingError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [denyAccess, setDenyAccess] = useState(false);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [description, setDescription] = useState('');
  const [sharingOption, setSharingOption] = useState('');
  const [showSharingOption, setShowSharingOption] = useState(false);
  const [sharingOptionError, setSharingOptionError] = useState(false);
  const [thumbnail, setThumbnail] = useState();
  const [thumbPreview, setThumbPreview] = useState();
  const [thumbError, setThumbError] = useState('');
  const [creating, setCreating] = useState(false);
  const [errorOnCreate, setErrorOnCreate] = useState(false);
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);
  const [params] = useState({ page_size: 30 });

  const contentListWrapperRef = useRef();
  const thumbInputFileRef = useRef();
  const mounted = useRef();
  const source = useRef();

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
    if (contentListWrapperRef.current) {
      contentListWrapperRef.current.scrollTo(0, 0);
    }
  }, [contentWrapperRef]);

  useEffect(() => {
    mounted.current = true;
    source.current = axios.CancelToken.source();

    (async () => {
      try {
        clearState();
        const { data } = await justChooseApi.get(`/contentlists/${listId}`, {
          cancelToken: source.current.token,
        });
        if (profileId !== data.profile_id) {
          setDenyAccess(true);
          return;
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        if (error.response && error.response.status === 400) {
          setNotFound(true);
        } else if (error.response && error.response.status === 403) {
          setDenyAccess(true);
        } else {
          setLoadingError(true);
        }
      }
    })();

    return () => {
      mounted.current = false;
      source.current.cancel();
    };
  }, [listId, profileId]);

  const {
    loading: loadingContent,
    error: loadingContentError,
    content,
    lastElementRef: lastContentRef,
  } = useLoadMoreWhenLastElementIsOnScreen(
    `/contentlists/${listId}/content`,
    params
  );

  useEffect(() => {
    if (creating) {
      setSeverity('info');
      setMessage('Por favor, aguarde. Criando votação...');
    } else if (errorOnCreate) {
      setSeverity('error');
      setMessage(
        'Não foi possível criar a votação. Por favor, tente novamente.'
      );
    } else if (createdSuccessfully) {
      setSeverity('success');
      setMessage('Votação criada com sucesso.');
    }
  }, [creating, errorOnCreate, createdSuccessfully, setMessage, setSeverity]);

  const clearState = () => {
    setLoadingError(false);
    setNotFound(false);
    setDenyAccess(false);
    setTitle('');
    setTitleError('');
    setDescription('');
    setSharingOption('');
    setShowSharingOption(false);
    setSharingOptionError(false);
    setThumbnail(null);
    setThumbPreview(null);
    setThumbError('');
    setCreating(false);
    setErrorOnCreate(false);
    setCreatedSuccessfully(false);
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

  const handleSharingOption = (option) => {
    setSharingOption(option);
    setSharingOptionError(false);
    setShowSharingOption(false);
  };

  const handleSelectOnPressEnter = (e, cb, option) => {
    if (e.key === 'Enter') {
      cb(option);
      document.activeElement
        .closest('[data-select]')
        .querySelector('[data-select-button]')
        .focus();
    }
  };

  const handleThumbnail = () => {
    thumbInputFileRef.current.click();
  };

  const handleThumbnailKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleThumbnail();
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
    setCreatedSuccessfully(false);
    setShowAlert(true);
    setCreating(true);
    clearTimeout(alertTimeout);

    let pollId;
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
        const { data } = await justChooseApi({
          url: '/polls',
          method: 'POST',
          data: formData,
        });
        pollId = data.id;
      } catch (error) {
        if (mounted.current) {
          setErrorOnCreate(true);
        }
      }
    } else {
      if (mounted.current) {
        setErrorOnCreate(true);
      }
    }

    if (mounted.current) {
      setCreating(false);
    }
    setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    if (pollId) {
      if (mounted.current) {
        setCreatedSuccessfully(true);
      }
      return history.push(`/polls/${pollId}`);
    }

    contentWrapperRef.current.scrollTo(0, 0);
  };

  if (loadingError) {
    return <SomethingWentWrong />;
  }
  if (notFound) {
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
                maxLength="100"
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
              maxLength="1000"
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
                    : sharingOptions.poll.find((e) => e.value === sharingOption)
                        .key
                }
                dropDownAlign="left"
                show={showSharingOption}
                setShow={setShowSharingOption}
              >
                <Options>
                  {sharingOptions.poll.map((o, i) => (
                    <Option
                      key={`sharingOption${i}`}
                      onClick={() => {
                        handleSharingOption(o.value);
                      }}
                      onKeyPress={(e) =>
                        handleSelectOnPressEnter(
                          e,
                          handleSharingOption,
                          o.value
                        )
                      }
                      tabIndex="-1"
                      data-select-option
                    >
                      <SharingOption>
                        <div>{o.key}</div>
                        <div>{o.description}</div>
                      </SharingOption>
                    </Option>
                  ))}
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
            <div className="column button-wrapper">
              <div className="file-input">
                <label
                  htmlFor="thumbnail"
                  onKeyPress={handleThumbnailKeyPress}
                  tabIndex="0"
                >
                  Selecione uma imagem
                </label>
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
            <ContentListWrapper ref={contentListWrapperRef} tabIndex="-1">
              <InfinityLoadContentGrid
                loading={loadingContent}
                error={loadingContentError}
                content={content}
                lastElementRef={lastContentRef}
                tabIndex="-1"
              />
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
