import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

import NotFound from '../../components/NotFound';
import AccessDenied from '../../components/AccessDenied';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import ContentGrid from '../../components/ContentGrid';
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
  Options,
  Option,
  SharingOption,
  ContentListWrapper,
  CreationOptions,
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

const UpdatePoll = ({ wrapperRef }) => {
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

  const [loadingError, setLoadingError] = useState(false);
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
  const [contentListId, setContentListId] = useState('');
  const [contentList, setContentList] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [errorOnCreate, setErrorOnCreate] = useState(false);

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
        const { data } = await justChooseApi.get(`/polls/${pollId}`);
        if (userId !== data.user_id) {
          setDenyAccess(true);
          return;
        }
        setTitle(data.title);
        setDescription(data.description);
        setSharingOption(data.sharing_option);
        setThumbPreview(data.thumbnail);
        setContentListId(data.content_list_id);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setLoadingError(true);
        }
        if (error.response && error.response.status === 403) {
          setDenyAccess(true);
        }
      }
    })();
  }, [pollId, userId]);

  useEffect(() => {
    (async () => {
      if (contentListId) {
        try {
          const { data } = await justChooseApi.get(
            `/contentlists/${contentListId}`
          );
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
      }
    })();
  }, [contentListId, userId]);

  useEffect(() => {
    if (updating) {
      setSeverity('info');
      setMessage('Por favor, aguarde. Atualizando votação...');
    } else if (errorOnCreate) {
      setSeverity('error');
      setMessage(
        'Não foi possível atualizar a votação. Por favor, tente novamente.'
      );
    } else {
      setSeverity('success');
      setMessage('Votação atualizada com sucesso.');
    }
  }, [updating, errorOnCreate, setMessage, setSeverity]);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setSharingOption('');
    setThumbnail(null);
    setThumbPreview(null);
    setContentListId('');
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

    return isValid;
  };

  const handleUpdatePoll = async () => {
    setErrorOnCreate(false);
    setShowAlert(true);
    setUpdating(true);
    clearTimeout(alertTimeout);

    let successfulyUpdated = true;
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
        setErrorOnCreate(true);
        successfulyUpdated = false;
      }
    } else {
      setErrorOnCreate(true);
      successfulyUpdated = false;
    }

    setUpdating(false);
    setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    if (successfulyUpdated) {
      history.push(`/polls/${pollId}`);
    }
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
        <div className="content-list">
          <ContentListContainer>
            <ContentListWrapper ref={contentListWrapperRef}>
              <ContentGrid content={contentList} />
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
