import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import { FaHeart, FaRegHeart, FaVoteYea, FaTrash } from 'react-icons/fa';
import { BiGitRepoForked } from 'react-icons/bi';
import { MdSettings } from 'react-icons/md';

import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

import justChooseApi from '../../apis/justChooseApi';
import NotFound from '../../components/NotFound';
import AccessDenied from '../../components/AccessDenied';
import ContentGrid from '../../components/ContentGrid';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import Modal from '../../components/Modal';
import DeleteListDialog from '../../components/DeleteListDialog';
import ShowListSkeleton from '../../components/Skeleton/ShowListSkeleton';

import {
  Container,
  Header,
  HeaderRow,
  TitleWrapper,
  HeaderButtons,
  HeaderButton,
  HeaderDeleteButton,
  ListInfo,
  Description,
  Filters,
  TypeOptions,
  Option,
  Main,
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

  const { userId, authenticated } = useContext(AuthContext);
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);
  const { colors } = useContext(ThemeContext);

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
        if (authenticated) {
          const {
            data: { like },
          } = await justChooseApi.get(`/contentlists/${listId}/like`);
          setLiked(like);
        }
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
  }, [listId, authenticated]);

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
    if (!authenticated) {
      return;
    }
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
    if (!authenticated) {
      return;
    }
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
      history.push(`/lists/${data.forked_list_id}`);
    } catch (error) {
      setLoading(false);
      setMessage('Não foi possível criar a lista. Por favor, tente novamente.');
      setSeverity('error');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    }
  };

  const handleDelete = async () => {
    if (!authenticated) {
      return;
    }
    try {
      setShowDeleteDialog(false);
      clearTimeout(alertTimeout);
      setMessage('Por favor, aguarde. Excluindo lista...');
      setSeverity('info');
      setShowAlert(true);
      await justChooseApi.delete(`/contentlists/${listId}`);
      setMessage('Lista excluída com sucesso.');
      setSeverity('success');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      history.push('/');
    } catch (error) {
      setMessage(
        'Não foi possível excluir a lista. Por favor, tente novamente.'
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
          <TitleWrapper>
            <h1 title={contentList.title}>{contentList.title}</h1>
          </TitleWrapper>
          <HeaderButtons>
            <div>
              <HeaderButton
                title={
                  authenticated ? (liked ? 'Não gostei' : 'Gostei') : 'Likes'
                }
                onClick={handleLike}
              >
                {!liked && (
                  <FaRegHeart size={'25px'} style={{ flexShrink: 0 }} />
                )}
                {liked && <FaHeart size={'25px'} style={{ flexShrink: 0 }} />}
                <span>{contentList.likes}</span>
              </HeaderButton>
              <HeaderButton
                title={
                  authenticated
                    ? 'Criar uma cópia da lista para sua conta'
                    : 'Forks'
                }
                onClick={handleFork}
              >
                <BiGitRepoForked size={'25px'} style={{ flexShrink: 0 }} />
                <span>{contentList.forks}</span>
              </HeaderButton>
            </div>
            {userId === contentList.user_id && (
              <div>
                <Link to={`/lists/${listId}/poll`}>
                  <HeaderButton title="Criar uma votação a partir da lista">
                    <FaVoteYea
                      size={'25px'}
                      style={{ flexShrink: 0, margin: '0 5px' }}
                    />
                  </HeaderButton>
                </Link>
                <Link to={`/lists/${listId}/update`}>
                  <HeaderButton title="Editar lista">
                    <MdSettings
                      size={'25px'}
                      style={{ flexShrink: 0, margin: '0 5px' }}
                    />
                  </HeaderButton>
                </Link>
                <HeaderDeleteButton
                  title="Excluir lista"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <FaTrash
                    size={'25px'}
                    style={{ flexShrink: 0, margin: '0 5px' }}
                  />
                </HeaderDeleteButton>
              </div>
            )}
          </HeaderButtons>
        </HeaderRow>
        <ListInfo>
          <span>
            Criada em{' '}
            <span className="created-at">
              {createdAt
                ? `${createdAt.getDate()}  de ${getMonth(
                    createdAt.getMonth()
                  )} de ${createdAt.getFullYear()}`
                : '-'}
            </span>{' '}
          </span>
          <span>
            por <span className="created-by">{contentList.user_name}</span>
          </span>
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
                background={colors['background-600']}
                hover={colors['background-700']}
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
      <Main>{content && <ContentGrid content={content} />}</Main>
      <Modal show={showDeleteDialog} setShow={setShowDeleteDialog}>
        <DeleteListDialog
          createdBy={contentList.user_name}
          listTitle={contentList.title}
          handleDelete={handleDelete}
        />
      </Modal>
    </Container>
  );
};

export default ShowList;
