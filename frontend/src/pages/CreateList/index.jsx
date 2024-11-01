import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GoSearch } from 'react-icons/go';

import { LayoutContext } from '../../context/LayoutContext';
import { AlertContext } from '../../context/AlertContext';

import SingleOptionSelect from '../../components/SingleOptionSelect';
import MovieFilters from '../../components/MovieFilters';
import ShowFilters from '../../components/ShowFilters';
import GameFilters from '../../components/GameFilters';
import ContentList from '../../components/ContentList';
import justChooseApi from '../../services/justChooseApi';
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

const CreateList = () => {
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);
  const { contentWrapperRef } = useContext(LayoutContext);

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
  const [contentList, setContentList] = useState([]);
  const [showListPreview, setShowListPreview] = useState(false);
  const [creating, setCreating] = useState(false);
  const [errorOnCreate, setErrorOnCreate] = useState(false);
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');

  const contentListWrapperRef = useRef();
  const thumbInputFileRef = useRef();
  const mounted = useRef();

  const contentTypesList = ['Filme', 'Série', 'Jogo'];

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef]);

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
    if (creating) {
      setSeverity('info');
      setMessage('Por favor, aguarde. Criando lista...');
    } else if (errorOnCreate) {
      setSeverity('error');
      setMessage('Não foi possível criar a lista. Por favor, tente novamente.');
    } else if (createdSuccessfully) {
      setSeverity('success');
      setMessage('Lista criada com sucesso.');
    }
  }, [creating, errorOnCreate, createdSuccessfully, setMessage, setSeverity]);

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
    setCreatedSuccessfully(false);
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
        if (mounted.current) {
          setErrorOnCreate(true);
        }
      }
    } else {
      setErrorOnCreate(true);
    }

    if (mounted.current) {
      setCreating(false);
    }
    setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    if (listId) {
      if (mounted.current) {
        setCreatedSuccessfully(true);
      }
      return history.push(`/lists/${listId}`);
    }
    contentWrapperRef.current.scrollTo(0, 0);
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
                    : sharingOptions.contentList.find(
                        (e) => e.value === sharingOption
                      ).key
                }
                dropDownAlign="left"
                show={showSharingOption}
                setShow={setShowSharingOption}
                width="150px"
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
        <div className={!contentType ? null : 'content-list'}>
          <ContentListContainer>
            <ContentListHeader>
              <div className="wrapper">
                <div className="wrapper content-type-wrapper">
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
                    <GoSearch size={15} style={{ flexShrink: 0 }} />
                    <input
                      type="search"
                      id="search"
                      placeholder="Buscar"
                      onKeyPress={handleContentInputEnterKey}
                    />
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
            {contentType && (
              <ContentListWrapper ref={contentListWrapperRef} tabIndex="-1">
                <ContentList
                  requestType={requestType}
                  contentType={contentType}
                  params={params}
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
              <div>
                <ClearButton onClick={handleClearList}>
                  Limpar lista
                </ClearButton>
              </div>
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
