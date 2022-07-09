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

const UpdatePoll = () => {
  const { id: pollId } = useParams();
  const history = useHistory();

  const { userId } = useContext(AuthContext);
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
  const [updating, setUpdating] = useState(false);
  const [errorOnUpdate, setErrorOnUpdate] = useState(false);
  const [updatedSuccessfully, setUpdatedSuccessfully] = useState(false);
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

    return () => {
      mounted.current = false;
      source.current.cancel();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        clearState();
        const { data } = await justChooseApi.get(`/polls/${pollId}`, {
          cancelToken: source.current.token,
        });
        if (userId !== data.user_id) {
          setDenyAccess(true);
          return;
        }
        setTitle(data.title);
        setDescription(data.description);
        setSharingOption(data.sharing_option);
        setThumbPreview(data.thumbnail);
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
  }, [pollId, userId]);

  const {
    loading: loadingContent,
    error: loadingContentError,
    content,
    lastElementRef: lastContentRef,
  } = useLoadMoreWhenLastElementIsOnScreen(`/polls/${pollId}/content`, params);

  useEffect(() => {
    if (updating) {
      setSeverity('info');
      setMessage('Por favor, aguarde. Atualizando votação...');
    } else if (errorOnUpdate) {
      setSeverity('error');
      setMessage(
        'Não foi possível atualizar a votação. Por favor, tente novamente.'
      );
    } else if (updatedSuccessfully) {
      setSeverity('success');
      setMessage('Votação atualizada com sucesso.');
    }
  }, [updating, errorOnUpdate, updatedSuccessfully, setMessage, setSeverity]);

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
    thumbInputFileRef.current = null;
    setUpdating(false);
    setErrorOnUpdate(false);
    setUpdatedSuccessfully(false);
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

    return isValid;
  };

  const handleUpdatePoll = async () => {
    setErrorOnUpdate(false);
    setUpdatedSuccessfully(false);
    setShowAlert(true);
    setUpdating(true);
    clearTimeout(alertTimeout);

    let successfullyUpdated = true;
    const isValid = validateFields();
    if (isValid) {
      const data = {
        title,
        description,
        sharingOption,
      };

      const formData = new FormData();
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }
      formData.append('data', JSON.stringify(data));
      try {
        await justChooseApi({
          url: `/polls/${pollId}`,
          method: 'PUT',
          data: formData,
        });
      } catch (error) {
        if (mounted.current) {
          setErrorOnUpdate(true);
        }
        successfullyUpdated = false;
      }
    } else {
      setErrorOnUpdate(true);
      successfullyUpdated = false;
    }

    if (mounted.current) {
      setUpdating(false);
    }
    setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    if (successfullyUpdated) {
      if (mounted.current) {
        setUpdatedSuccessfully(true);
      }
      history.push(`/polls/${pollId}`);
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
        <h1>Editar Votação</h1>
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
                    : sharingOptions.poll.find((e) => e.value === sharingOption)
                        .key
                }
                dropDownAlign="left"
                show={showSharingOption}
                setShow={setShowSharingOption}
                width="150px"
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
              <CreateButton onClick={handleUpdatePoll} disabled={updating}>
                Aplicar alterações
              </CreateButton>
            </div>
          </CreationOptions>
        </div>
      </Main>
    </Container>
  );
};

export default UpdatePoll;