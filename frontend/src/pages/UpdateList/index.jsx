import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { LayoutContext } from '../../context/LayoutContext';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

import NotFound from '../../components/NotFound';
import SomethingWentWrong from '../../components/SomethingWentWrong';
import AccessDenied from '../../components/AccessDenied';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import AvailableContent from './AvailableContent';
import justChooseApi from '../../services/justChooseApi';
import useQuery from '../../hooks/useQuery';
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
  Options,
  Option,
  SharingOption,
  CreationOptions,
  ClearButton,
  PreviewButton,
  CreateButton,
} from './styles';

const UpdateList = () => {
  const { id: listId } = useParams();
  const history = useHistory();

  const { contentWrapperRef } = useContext(LayoutContext);
  const { authentication } = useContext(AuthContext);
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);

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
  const [contentList, setContentList] = useState([]);
  const [contentError, setContentError] = useState('');
  const [showListPreview, setShowListPreview] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorOnUpdate, setErrorOnUpdate] = useState(false);
  const [updatedSuccessfully, setUpdatedSuccessfully] = useState(false);

  const contentListWrapperRef = useRef();
  const thumbInputFileRef = useRef();
  const mounted = useRef();

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
    if (contentListWrapperRef.current) {
      contentListWrapperRef.current.scrollTo(0, 0);
    }
  }, [contentWrapperRef]);

  useEffect(() => {
    mounted.current = true;

    clearState();

    return () => {
      mounted.current = false;
    };
  }, []);

  const { isFetching, error, data } = useQuery(
    ['updateList/contentList', listId, authentication],
    async () => {
      const response = await justChooseApi.get(`/contentlists/${listId}`);
      return response.data;
    },
    { retry: false }
  );

  const { isFetching: isFetchingContent, data: content } = useQuery(
    ['updateList/contentList/content', listId],
    async () => {
      let data = [];
      for (let page = 1; ; page++) {
        const response = await justChooseApi.get(
          `/contentlists/${listId}/content`,
          {
            params: { page, page_size: 100 },
          }
        );
        data = [
          ...data,
          ...response.data.results.map((content) => ({
            content_platform_id: content.content_platform_id,
            title: content.title,
            poster_path: content.poster_path,
            type: content.type,
          })),
        ];
        if (page === response.data.total_pages) {
          break;
        }
      }
      return data;
    }
  );

  useEffect(() => {
    if (mounted.current) {
      setContentList(content);
    }
  }, [setContentList, content]);

  useEffect(() => {
    if (mounted.current) {
      setTitle(data?.title || '');
      setDescription(data?.description || '');
      setSharingOption(data?.sharing_option || '');
      setThumbPreview(data?.thumbnail || '');
    }
  }, [data]);

  useEffect(() => {
    if (mounted.current) {
      setContentError('');
    }
  }, [contentList]);

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

  if (
    (authentication &&
      data &&
      parseInt(authentication.profile.id) !== parseInt(data.profile_id)) ||
    error?.response?.status === 403
  ) {
    return <AccessDenied />;
  }
  if (error?.response?.status === 400) {
    return <NotFound />;
  }
  if (error) {
    return <SomethingWentWrong />;
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
        {authentication &&
          data &&
          parseInt(authentication.profile.id) === parseInt(data.profile_id) && (
            <div className="content-list">
              <AvailableContent
                contentType={contentType}
                setContentType={setContentType}
                contentList={contentList}
                setContentList={setContentList}
                showListPreview={showListPreview}
                setShowListPreview={setShowListPreview}
                isFetching={isFetchingContent}
              />
              <CreationOptions>
                <div>
                  <ClearButton onClick={handleClearList}>
                    Limpar lista
                  </ClearButton>
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
          )}
      </Main>
    </Container>
  );
};

export default UpdateList;
