import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GoSearch } from 'react-icons/go';

import { AlertContext } from '../../context/AlertContext';

import SingleOptionSelect from '../../components/SingleOptionSelect';
import MovieFilters from '../../components/MovieFilters';
import ShowFilters from '../../components/ShowFilters';
import GameFilters from '../../components/GameFilters';
import ContentList from '../../components/ContentList';
import justChooseApi from '../../apis/justChooseApi';

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

const CreateList = ({ wrapperRef }) => {
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);

  const history = useHistory();

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
  const [showListPreview, setShowListPreview] = useState(false);
  const [creating, setCreating] = useState(false);
  const [errorOnCreate, setErrorOnCreate] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');

  const contentListWrapperRef = useRef();
  const thumbInputFileRef = useRef();

  const contentTypesList = ['Filme', 'Série', 'Jogo'];

  useEffect(() => {
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  }, [wrapperRef]);

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
    if (creating) {
      setSeverity('info');
      setMessage('Por favor, aguarde. Criando lista...');
    } else if (errorOnCreate) {
      setSeverity('error');
      setMessage('Não foi possível criar a lista. Por favor, tente novamente.');
    } else {
      setSeverity('success');
      setMessage('Lista criada com sucesso.');
    }
  }, [creating, errorOnCreate, setMessage, setSeverity]);

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
    contentListWrapperRef.current.scrollTop = 0;
    contentListWrapperRef.current.scrollLeft = 0;
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
    if (!thumbnail) {
      setThumbError('Por favor, selecione uma miniatura para a lista');
      isValid = false;
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

  const handleCreateList = async () => {
    setErrorOnCreate(false);
    setShowAlert(true);
    setCreating(true);
    clearTimeout(alertTimeout);

    let listId;
    const isValid = validateFields();
    if (isValid) {
      const data = {
        title,
        description,
        sharingOption,
        content: contentList,
      };

      const formData = new FormData();
      formData.append('thumbnail', thumbnail);
      formData.append('data', JSON.stringify(data));
      try {
        const { data } = await justChooseApi({
          url: '/contentlists',
          method: 'POST',
          data: formData,
        });
        listId = data.id;
      } catch (error) {
        setErrorOnCreate(true);
      }
    } else {
      setErrorOnCreate(true);
    }

    setCreating(false);
    setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    if (listId) {
      return history.push(`/lists/${listId}`);
    }
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  };

  return (
    <Container>
      <Header>
        <h1>Nova Lista</h1>
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
            <div className="column button-wrapper">
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
        <div className={!contentType ? null : 'content-list'}>
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
                    <GoSearch size={15} style={{ flexShrink: 0 }} />
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
            {contentType && (
              <ContentListWrapper ref={contentListWrapperRef}>
                <ContentList
                  requestType={requestType}
                  contentType={contentType}
                  params={params}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  contentList={contentList}
                  setContentList={setContentList}
                  showPreview={showListPreview}
                  wrapperRef={contentListWrapperRef}
                />
              </ContentListWrapper>
            )}
          </ContentListContainer>
          {contentType && (
            <CreationOptions>
              <ClearButton onClick={handleClearList}>Limpar lista</ClearButton>
              <div>
                <PreviewButton onClick={handlePreviewList}>
                  {showListPreview ? 'Todos os conteúdos' : 'Minha lista'}
                </PreviewButton>
                <CreateButton onClick={handleCreateList} disabled={creating}>
                  Criar Lista
                </CreateButton>
              </div>
            </CreationOptions>
          )}
        </div>
      </Main>
    </Container>
  );
};

export default CreateList;
