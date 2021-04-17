import React, { useState, useEffect, useRef } from 'react';
import { GoSearch } from 'react-icons/go';

import SingleOptionSelect from '../../components/SingleOptionSelect';
import MovieFilters from '../../components/MovieFilters';
import ShowFilters from '../../components/ShowFilters';
import GameFilters from '../../components/GameFilters';
import ContentList from '../../components/ContentList';
import ContentListPreview from '../../components/ContentListPreview';
import justChooseApi from '../../apis/justChooseApi';

import {
  Container,
  StatusAlert,
  Header,
  Main,
  LabelWrapper,
  InputWrapper,
  TitleInput,
  ThumbnailWrapper,
  ThumbPreview,
  ContentListContainer,
  ContentListHeader,
  ContentTypes,
  Option,
  SearchWrapper,
  ContentListWrapper,
  CreationOptions,
  ClearButton,
  PreviewButton,
  CreateButton,
} from './styles';

const CreateMovieList = ({ wrapperRef }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  const [statusAlertTimeout, setStatusAlertTimeout] = useState();
  const [creating, setCreating] = useState(false);
  const [errorOnCreate, setErrorOnCreate] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');

  const contentListWrapperRef = useRef();

  const contentTypesList = ['Filme', 'Série', 'Jogo'];

  useEffect(() => {
    console.log(contentList);
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

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setThumbnail(null);
    setThumbPreview(null);
    setContentType('');
    setContentList([]);
    setShowListPreview(false);
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
    setThumbError('');
    setContentError('');
    let isValid = true;
    if (!title) {
      setTitleError('Por favor, insira um título para a lista');
      isValid = false;
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
    setShowStatusAlert(true);
    setCreating(true);
    clearTimeout(statusAlertTimeout);

    const isValid = validateFields();
    if (isValid) {
      const data = {
        title,
        description,
        content: contentList,
      };

      const formData = new FormData();
      formData.append('thumbnail', thumbnail);
      formData.append('data', JSON.stringify(data));
      try {
        await justChooseApi({
          url: '/contentlists',
          method: 'POST',
          data: formData,
        });
        clearForm();
      } catch (error) {
        setErrorOnCreate(true);
      }
    } else {
      setErrorOnCreate(true);
    }

    setCreating(false);
    const timeout = setTimeout(() => setShowStatusAlert(false), 4000);
    setStatusAlertTimeout(timeout);
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  };

  const getStatusAlert = () => {
    return creating ? 'creating' : errorOnCreate ? 'error' : 'success';
  };

  const getStatusAlertMessage = () => {
    const status = getStatusAlert();
    return status === 'creating'
      ? 'Por favor aguarde. Criando lista...'
      : status === 'error'
      ? 'Não foi possível criar a lista. Por favor tente novamente.'
      : 'Lista criada com sucesso.';
  };

  return (
    <Container>
      <StatusAlert status={getStatusAlert()} show={showStatusAlert}>
        <p>{getStatusAlertMessage()}</p>
      </StatusAlert>
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
                    <ContentTypes>
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
                    </ContentTypes>
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
            {contentType && (
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

export default CreateMovieList;