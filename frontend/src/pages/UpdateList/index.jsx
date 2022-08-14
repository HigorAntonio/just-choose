import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { GoSearch } from 'react-icons/go';

import { LayoutContext } from '../../context/LayoutContext';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

import NotFound from '../../components/NotFound';
import SomethingWentWrong from '../../components/SomethingWentWrong';
import AccessDenied from '../../components/AccessDenied';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import MovieFilters from '../../components/MovieFilters';
import ShowFilters from '../../components/ShowFilters';
import GameFilters from '../../components/GameFilters';
import ContentList from '../../components/ContentList';
import justChooseApi from '../../services/justChooseApi';
import sharingOptions from '../../utils/sharingOptions';

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
  ContentListHeader,
  Options,
  Option,
  SharingOption,
  SearchWrapper,
  SearchInput,
  ContentListWrapper,
  ContentListSkeleton,
  CreationOptions,
  ClearButton,
  PreviewButton,
  CreateButton,
} from './styles';

const UpdateList = () => {
  const { id: listId } = useParams();
  const history = useHistory();

  const { contentWrapperRef } = useContext(LayoutContext);
  const { profileId } = useContext(AuthContext);
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);
  const { title: theme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
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
  const [contentType, setContentType] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [params, setParams] = useState({});
  const [contentList, setContentList] = useState([]);
  const [contentError, setContentError] = useState('');
  const [showListPreview, setShowListPreview] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorOnUpdate, setErrorOnUpdate] = useState(false);
  const [updatedSuccessfully, setUpdatedSuccessfully] = useState(false);

  const contentListWrapperRef = useRef();
  const thumbInputFileRef = useRef();
  const mounted = useRef();
  const source = useRef();

  const contentTypesList = ['Filme', 'Série', 'Jogo'];

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
    if (contentListWrapperRef.current) {
      contentListWrapperRef.current.scrollTo(0, 0);
    }
  }, [contentWrapperRef]);

  const loadContentListContent = useCallback(async () => {
    try {
      for (let page = 1; ; page++) {
        const { data } = await justChooseApi.get(
          `/contentlists/${listId}/content`,
          {
            cancelToken: source.current.token,
            params: { page, page_size: 100 },
          }
        );
        setContentList((prevState) => [
          ...prevState,
          ...data.results.map((c) => ({
            content_platform_id: c.content_platform_id,
            title: c.title,
            poster_path: c.poster_path,
            type: c.type,
          })),
        ]);
        if (page === data.total_pages) {
          break;
        }
      }
    } catch (error) {
      throw error;
    }
  }, [listId]);

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
          setLoading(false);
          return;
        }
        setTitle(data.title);
        setDescription(data.description);
        setSharingOption(data.sharing_option);
        setThumbPreview(data.thumbnail);
        await loadContentListContent();
        setLoading(false);
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
        setLoading(false);
      }
    })();

    return () => {
      mounted.current = false;
      source.current.cancel();
    };
  }, [listId, profileId, loadContentListContent]);

  useEffect(() => {
    setContentError('');
  }, [contentList]);

  useEffect(() => {
    setParams({});
    if (contentType === 'Filme') {
      setRequestType('movie');
    } else if (contentType === 'Série') {
      setRequestType('show');
    } else if (contentType === 'Jogo') {
      setRequestType('game');
    }
  }, [contentType]);

  useEffect(() => {
    if (updating) {
      setSeverity('info');
      setMessage('Por favor, aguarde. Atualizando lista...');
    } else if (errorOnUpdate) {
      setSeverity('error');
      setMessage(
        'Não foi possível atualizar a lista. Por favor, tente novamente.'
      );
    } else if (updatedSuccessfully) {
      setSeverity('success');
      setMessage('Lista atualizada com sucesso.');
    }
  }, [updating, errorOnUpdate, updatedSuccessfully, setMessage, setSeverity]);

  const clearState = () => {
    setLoading(true);
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
    setContentType('');
    setShowContent(false);
    setRequestType('');
    setContentList([]);
    setContentError('');
    setShowListPreview(true);
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

  const handleContentInputEnterKey = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      if (contentType === 'Filme') {
        setRequestType('movie-search');
        setParams({ query: e.target.value });
      } else if (contentType === 'Série') {
        setRequestType('show-search');
        setParams({ query: e.target.value });
      } else if (contentType === 'Jogo') {
        setRequestType('game');
        setParams({ search: e.target.value });
      }
      setShowListPreview(false);
    }
  };

  const handleSharingOption = (option) => {
    setSharingOption(option);
    setSharingOptionError(false);
    setShowSharingOption(false);
  };

  const handleContentType = (option) => {
    setContentType(option);
    setShowContent(false);
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

  const handleClearList = () => {
    setContentList([]);
  };

  const handlePreviewList = () => {
    setShowListPreview((prevState) => !prevState);
    contentListWrapperRef.current.scrollTo(0, 0);
  };

  const validateFields = () => {
    setTitleError('');
    setSharingOptionError('');
    setThumbError('');
    setContentError('');
    let isValid = true;
    if (!title) {
      setTitleError('Por favor, insira um título para a lista');
      isValid = false;
    }
    if (!sharingOption) {
      setSharingOptionError(
        'Por favor, selecione uma opção de compartilhamento para a lista'
      );
    }
    if (contentList.length < 1) {
      setContentError('Por favor, selecione o conteúdo da lista');
      isValid = false;
    }
    if (contentList.length > 100) {
      setContentError(
        `Desculpe, a lista não pode ter mais que cem itens. Lista atual: ${contentList.length} itens`
      );
      isValid = false;
    }

    return isValid;
  };

  const handleUpdateList = async () => {
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
        content: contentList,
      };

      const formData = new FormData();
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }
      formData.append('data', JSON.stringify(data));
      try {
        await justChooseApi({
          url: `/contentlists/${listId}`,
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
      history.push(`/lists/${listId}`);
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
        <h1>Editar Lista</h1>
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
                    : sharingOptions.contentList.find(
                        (e) => e.value === sharingOption
                      ).key
                }
                dropDownAlign="left"
                show={showSharingOption}
                setShow={setShowSharingOption}
              >
                <Options>
                  {sharingOptions.contentList.map((o, i) => (
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
        {contentError && <p className="error">{contentError}</p>}
        <div className="content-list">
          <ContentListContainer>
            <ContentListHeader>
              <div className="wrapper">
                <div className="wrapper content-type-wrapper">
                  <label>Tipo de conteúdo</label>
                  <SingleOptionSelect
                    label={!contentType ? 'Selecionar' : contentType}
                    dropDownAlign="left"
                    show={showContent}
                    setShow={setShowContent}
                  >
                    <Options minWidth={'120px'}>
                      {contentTypesList.map((ct, i) => (
                        <Option
                          key={`contentTypesList${i}`}
                          onClick={() => {
                            handleContentType(ct);
                          }}
                          onKeyPress={(e) =>
                            handleSelectOnPressEnter(e, handleContentType, ct)
                          }
                          tabIndex="-1"
                          data-select-option
                        >
                          {ct}
                        </Option>
                      ))}
                    </Options>
                  </SingleOptionSelect>
                </div>
                {contentType && (
                  <SearchWrapper>
                    <SearchInput>
                      <GoSearch size={'1.5rem'} style={{ flexShrink: 0 }} />
                      <input
                        type="search"
                        id="search"
                        placeholder="Buscar"
                        onKeyPress={handleContentInputEnterKey}
                      />
                    </SearchInput>
                  </SearchWrapper>
                )}
              </div>
              {contentType === 'Filme' && (
                <div className="wrapper">
                  <MovieFilters
                    setParams={setParams}
                    setRequestType={setRequestType}
                    setShowListPreview={setShowListPreview}
                  />
                </div>
              )}
              {contentType === 'Série' && (
                <div className="wrapper">
                  <ShowFilters
                    setParams={setParams}
                    setRequestType={setRequestType}
                    setShowListPreview={setShowListPreview}
                  />
                </div>
              )}
              {contentType === 'Jogo' && (
                <div className="wrapper">
                  <GameFilters
                    setParams={setParams}
                    setRequestType={setRequestType}
                    setShowListPreview={setShowListPreview}
                  />
                </div>
              )}
            </ContentListHeader>

            <ContentListWrapper ref={contentListWrapperRef} tabIndex="-1">
              {!loading && (
                <ContentList
                  requestType={requestType}
                  contentType={contentType}
                  params={params}
                  contentList={contentList}
                  setContentList={setContentList}
                  showPreview={showListPreview}
                  wrapperRef={contentListWrapperRef}
                  showSkeleton={!!contentType}
                />
              )}
              {loading && (
                <ContentListSkeleton>
                  {[...Array(30).keys()].map((c) => (
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
                </ContentListSkeleton>
              )}
            </ContentListWrapper>
          </ContentListContainer>

          <CreationOptions>
            <div>
              <ClearButton onClick={handleClearList}>Limpar lista</ClearButton>
            </div>
            <div>
              {contentType && (
                <PreviewButton onClick={handlePreviewList}>
                  {showListPreview ? 'Todos os conteúdos' : 'Minha lista'}
                </PreviewButton>
              )}
              <CreateButton onClick={handleUpdateList} disabled={updating}>
                Aplicar alterações
              </CreateButton>
            </div>
          </CreationOptions>
        </div>
      </Main>
    </Container>
  );
};

export default UpdateList;
