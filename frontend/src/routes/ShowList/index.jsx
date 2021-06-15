import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { FaVoteYea } from 'react-icons/fa';
import { BiGitRepoForked } from 'react-icons/bi';
import { MdSettings } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

import justChooseApi from '../../apis/justChooseApi';
import NotFound from '../../components/NotFound';
import AccessDenied from '../../components/AccessDenied';
import ContentCardSimple from '../../components/ContentCardSimple';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import Modal from '../../components/Modal';
import DeleteListDialog from '../../components/DeleteListDialog';
import ShowListSkeleton from '../../components/Skeleton/ShowListSkeleton';

import {
  Container,
  Header,
  HeaderRow,
  HeaderButtons,
  HeaderButton,
  HeaderDeleteButton,
  ListInfo,
  Description,
  Filters,
  TypeOptions,
  Option,
  Main,
  ContentListContainer,
} from './styles';

const getMonth = (month) => {
  switch (month) {
    case 0:
      return 'janeiro';
    case 1:
      return 'fevereiro';
    case 2:
      return 'março';
    case 3:
      return 'abril';
    case 4:
      return 'maio';
    case 5:
      return 'junho';
    case 6:
      return 'julho';
    case 7:
      return 'agosto';
    case 8:
      return 'setembro';
    case 9:
      return 'outubro';
    case 10:
      return 'novembro';
    case 11:
      return 'dezembro';
    default:
      return '-';
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

const getTypeOption = (type) => {
  switch (type) {
    case 'all':
      return 'Todos';
    case 'movie':
      return 'Filmes';
    case 'show':
      return 'Séries';
    case 'game':
      return 'Jogos';
    default:
      return '';
  }
};

const getFilteredContent = (content, contentTypes, typeFilter) => {
  if (typeFilter === 'all') {
    let filteredContent = [];
    contentTypes.map(
      (t) => (filteredContent = [...filteredContent, ...content[`${t}s`]])
    );
    return filteredContent;
  }
  if (typeFilter === 'movie') {
    return content.movies;
  }
  if (typeFilter === 'show') {
    return content.shows;
  }
  if (typeFilter === 'game') {
    return content.games;
  }
};

const ShowList = ({ wrapperRef }) => {
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

  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [denyAccess, setDenyAccess] = useState(false);
  const [contentList, setContentList] = useState({});
  const [createdAt, setCreatedAt] = useState();
  const [content, setContent] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [liked, setLiked] = useState();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  }, [wrapperRef]);

  const clearState = () => {
    setLoadingError(false);
    setDenyAccess(false);
    setContentList({});
    setCreatedAt(null);
    setContent([]);
    setContentTypes([]);
    setTypeFilter('all');
    setShowTypeOptions(false);
    setLiked(null);
    setShowDeleteDialog(false);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        clearState();
        const { data } = await justChooseApi.get(`/contentlists/${listId}`);
        setContentList(data);
        setCreatedAt(new Date(data.created_at));
        setContentTypes(['all', ...data.content_types]);
        const {
          data: { like },
        } = await justChooseApi.get(`/contentlists/${listId}/like`);
        setLiked(like);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 400) {
          setLoadingError(true);
        }
        if (error.response && error.response.status === 403) {
          setDenyAccess(true);
        }
      }
    })();
  }, [listId]);

  useEffect(() => {
    if (JSON.stringify(contentList) !== '{}') {
      setContent(
        getFilteredContent(
          contentList.content,
          contentList.content_types,
          typeFilter
        )
      );
    }
  }, [contentList, typeFilter]);

  const handleLike = async () => {
    try {
      if (!liked) {
        await justChooseApi.post(`/contentlists/${listId}/like`);
        setContentList((prevState) => ({
          ...prevState,
          likes: prevState.likes + 1,
        }));
      }
      if (liked) {
        await justChooseApi.delete(`/contentlists/${listId}/like`);
        setContentList((prevState) => ({
          ...prevState,
          likes: prevState.likes - 1,
        }));
      }
      setLiked((prevState) => !prevState);
    } catch (error) {}
  };

  const handleFork = async () => {
    try {
      setLoading(true);
      clearTimeout(alertTimeout);
      setMessage('Por favor, aguarde. Criando lista...');
      setSeverity('info');
      setShowAlert(true);
      const { data } = await justChooseApi.post(
        `/contentlists/${listId}/fork/`
      );
      setLoading(false);
      setMessage('Lista criada com sucesso.');
      setSeverity('success');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      history.push(`/list/${data.forked_list_id}`);
    } catch (error) {
      setLoading(false);
      setMessage('Não foi possível criar a lista. Por favor, tente novamente.');
      setSeverity('error');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    }
  };

  const handlePoll = () => {
    history.push(`/list/${listId}/poll`);
  };

  const handleUpdate = () => {
    history.push(`/list/${listId}/update`);
  };

  const handleDelete = async () => {
    try {
      setShowDeleteDialog(false);
      clearTimeout(alertTimeout);
      setMessage('Por favor aguarde. Excluindo lista...');
      setSeverity('info');
      setShowAlert(true);
      await justChooseApi.delete(`/contentlists/${listId}`);
      setMessage('Lista excluída com sucesso.');
      setSeverity('success');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      history.push('/');
    } catch (error) {
      setMessage(
        'Não foi possível excluir a lista. Por favor tente novamente.'
      );
      setSeverity('error');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    }
  };

  if (loading) {
    return <ShowListSkeleton />;
  }
  if (loadingError) {
    return <NotFound />;
  }
  if (denyAccess) {
    return <AccessDenied />;
  }
  return (
    <Container>
      <Header>
        <HeaderRow>
          <h1>{contentList.title}</h1>
          <HeaderButtons>
            <HeaderButton
              title={liked ? 'Não gostei' : 'Gostei'}
              onClick={handleLike}
            >
              {!liked && (
                <FaRegHeart
                  size={'25px'}
                  color="#fff"
                  style={{ flexShrink: 0 }}
                />
              )}
              {liked && (
                <FaHeart size={'25px'} color="#fff" style={{ flexShrink: 0 }} />
              )}
              <span>{contentList.likes}</span>
            </HeaderButton>
            <HeaderButton
              title="Criar uma cópia da lista para sua conta"
              onClick={handleFork}
            >
              <BiGitRepoForked
                size={'25px'}
                color="#fff"
                style={{ flexShrink: 0 }}
              />
              <span>{contentList.forks}</span>
            </HeaderButton>
            {userId === contentList.user_id && (
              <>
                <HeaderButton
                  title="Criar uma votação a partir da lista"
                  onClick={handlePoll}
                >
                  <FaVoteYea
                    size={'25px'}
                    color="#fff"
                    style={{ flexShrink: 0, margin: '0 5px' }}
                  />
                </HeaderButton>
                <HeaderButton title="Editar lista" onClick={handleUpdate}>
                  <MdSettings
                    size={'25px'}
                    color="#fff"
                    style={{ flexShrink: 0, margin: '0 5px' }}
                  />
                </HeaderButton>
                <HeaderDeleteButton
                  title="Excluir lista"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <FaTrash
                    size={'25px'}
                    color="#fff"
                    style={{ flexShrink: 0, margin: '0 5px' }}
                  />
                </HeaderDeleteButton>
                <Modal show={showDeleteDialog} setShow={setShowDeleteDialog}>
                  <DeleteListDialog
                    createdBy={contentList.user_name}
                    listTitle={contentList.title}
                    handleDelete={handleDelete}
                  />
                </Modal>
              </>
            )}
          </HeaderButtons>
        </HeaderRow>
        <ListInfo>
          Criada em{' '}
          <span className="created-at">
            {createdAt
              ? `${createdAt.getDate()}  de ${getMonth(
                  createdAt.getMonth()
                )} de ${createdAt.getFullYear()}`
              : '-'}
          </span>{' '}
          por <span className="created-by">{contentList.user_name}</span>
        </ListInfo>
        <Description>{contentList.description}</Description>
        <Filters>
          {contentTypes.length > 2 && (
            <>
              <label>Tipo</label>
              <SingleOptionSelect
                label={!typeFilter ? 'Todos' : getTypeOption(typeFilter)}
                dropDownAlign="center"
                show={showTypeOptions}
                setShow={setShowTypeOptions}
                width="85px"
              >
                <TypeOptions>
                  {contentTypes.map((t, i) => (
                    <Option
                      key={`typeFilter${i}`}
                      onClick={() => {
                        typeFilter !== t && setTypeFilter(t);
                        setShowTypeOptions(false);
                      }}
                    >
                      {getTypeOption(t)}
                    </Option>
                  ))}
                </TypeOptions>
              </SingleOptionSelect>
            </>
          )}
        </Filters>
      </Header>
      <Main>
        {contentList.content && (
          <ContentListContainer>
            {content.length > 0 &&
              content.map((c, i) => {
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
          </ContentListContainer>
        )}
      </Main>
    </Container>
  );
};

export default ShowList;
