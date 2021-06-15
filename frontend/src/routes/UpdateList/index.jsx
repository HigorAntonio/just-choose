import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { GoSearch } from 'react-icons/go';

import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

import SingleOptionSelect from '../../components/SingleOptionSelect';
import MovieFilters from '../../components/MovieFilters';
import ShowFilters from '../../components/ShowFilters';
import GameFilters from '../../components/GameFilters';
import ContentList from '../../components/ContentList';
import ContentListPreview from '../../components/ContentListPreview';
import justChooseApi from '../../apis/justChooseApi';
import NotFound from '../../components/NotFound';
import AccessDenied from '../../components/AccessDenied';

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
  ContentListWrapper,
  CreationOptions,
  ClearButton,
  PreviewButton,
  CreateButton,
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

const UpdateList = ({ wrapperRef }) => {
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
  const [contentType, setContentType] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [params, setParams] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [contentList, setContentList] = useState([]);
  const [showListPreview, setShowListPreview] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorOnUpdate, setErrorOnUpdate] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');

  const contentListWrapperRef = useRef();
  const thumbInputFileRef = useRef();

  const contentTypesList = ['Filme', 'Série', 'Jogo'];

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
        setTitle(data.title);
        setDescription(data.description);
        setSharingOption(data.sharing_option);
        setThumbPreview(data.thumbnail);
        let content = [];
        Object.keys(data.content).map(
          (key) =>
            (content = [
              ...content,
              ...data.content[key].map((c) => ({
                contentId: c.content_platform_id,
                poster:
                  c.type === 'game'
                    ? c.poster_path
                    : `${process.env.REACT_APP_TMDB_POSTER_URL}w185${c.poster_path}`,
                title: c.title,
                type: c.type,
              })),
            ])
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
    setContentError('');
  }, [contentList]);

  useEffect(() => {
    setPageNumber(1);
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
    } else {
      setSeverity('success');
      setMessage('Lista atualizada com sucesso.');
    }
  }, [updating, errorOnUpdate, setMessage, setSeverity]);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setSharingOption('');
    setThumbnail(null);
    setThumbPreview(null);
    thumbInputFileRef.current.value = null;
    setContentType('');
    setContentList([]);
    setShowListPreview(true);
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

  const handleKeyPress = (e) => {
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
      setPageNumber(1);
      setShowListPreview(false);
    }
  };

  const handleClearList = () => {
    setContentList([]);
  };

  const handlePreviewList = () => {
    setShowListPreview((prevState) => !prevState);
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
    setShowAlert(true);
    setUpdating(true);
    clearTimeout(alertTimeout);

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
        setErrorOnUpdate(true);
      }
    } else {
      setErrorOnUpdate(true);
    }

    setUpdating(false);
    setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    history.push(`/list/${listId}`);
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
        {contentError && <p className="error">{contentError}</p>}
        <div className="content-list">
          <ContentListContainer>
            <ContentListHeader>
              <div className="row">
                <div>
                  <label>Tipo de conteúdo</label>
                  <SingleOptionSelect
                    label={!contentType ? 'Selecionar' : contentType}
                    dropDownAlign="center"
                    show={showContent}
                    setShow={setShowContent}
                    width="75px"
                  >
                    <Options width={'120px'}>
                      {contentTypesList.map((ct, i) => (
                        <Option
                          key={`contentTypesList${i}`}
                          onClick={() => {
                            setContentType(ct);
                            setShowContent(false);
                          }}
                        >
                          {ct}
                        </Option>
                      ))}
                    </Options>
                  </SingleOptionSelect>
                </div>
                {contentType && (
                  <SearchWrapper>
                    <GoSearch
                      size={15}
                      color="#efeff1"
                      style={{ flexShrink: 0 }}
                    />
                    <input
                      type="search"
                      id="search"
                      placeholder="Buscar"
                      onKeyPress={handleKeyPress}
                    />
                  </SearchWrapper>
                )}
              </div>
              {contentType === 'Filme' && (
                <div className="row">
                  <MovieFilters
                    setParams={setParams}
                    setPageNumber={setPageNumber}
                    setRequestType={setRequestType}
                    setShowListPreview={setShowListPreview}
                  />
                </div>
              )}
              {contentType === 'Série' && (
                <div className="row">
                  <ShowFilters
                    setParams={setParams}
                    setPageNumber={setPageNumber}
                    setRequestType={setRequestType}
                    setShowListPreview={setShowListPreview}
                  />
                </div>
              )}
              {contentType === 'Jogo' && (
                <div className="row">
                  <GameFilters
                    setParams={setParams}
                    setPageNumber={setPageNumber}
                    setRequestType={setRequestType}
                    setShowListPreview={setShowListPreview}
                  />
                </div>
              )}
            </ContentListHeader>

            <ContentListWrapper ref={contentListWrapperRef}>
              {!showListPreview && (
                <ContentList
                  requestType={requestType}
                  contentType={contentType}
                  params={params}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  contentList={contentList}
                  setContentList={setContentList}
                  wrapperRef={contentListWrapperRef}
                />
              )}
              {showListPreview && (
                <ContentListPreview
                  contentType={contentType}
                  contentList={contentList}
                  setContentList={setContentList}
                />
              )}
            </ContentListWrapper>
          </ContentListContainer>

          <CreationOptions>
            <ClearButton onClick={handleClearList}>Limpar lista</ClearButton>
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
