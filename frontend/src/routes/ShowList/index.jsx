import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import { ThemeContext } from 'styled-components';
import { FaHeart, FaRegHeart, FaVoteYea, FaTrash } from 'react-icons/fa';
import { BiGitRepoForked } from 'react-icons/bi';
import { MdSettings } from 'react-icons/md';

import { LayoutContext } from '../../context/LayoutContext';
import { AuthContext } from '../../context/AuthContext';
import { ProfileContext } from '../../context/ProfileContext';
import { AlertContext } from '../../context/AlertContext';

import justChooseApi from '../../apis/justChooseApi';
import NotFound from '../../components/NotFound';
import AccessDenied from '../../components/AccessDenied';
import ContentGrid from '../../components/ContentGrid';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import Modal from '../../components/Modal';
import DeleteListDialog from '../../components/DeleteListDialog';
import ShowListSkeleton from '../../components/Skeleton/ShowListSkeleton';
import formatCount from '../../utils/formatCount';
import setQueryParamAndGetNewUrl from '../../utils/setQueryParamAndGetNewUrl';

import {
  Container,
  Header,
  HeaderRow,
  TitleWrapper,
  HeaderButtons,
  HeaderButton,
  HeaderDeleteButton,
  ListInfo,
  CreatedAt,
  CreatedBy,
  ProfileImageWrapper,
  Description,
  Filters,
  TypeOptions,
  Option,
  Main,
  Message,
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

const contentTypeList = [
  { key: 'Todos', value: 'all' },
  { key: 'Filme', value: 'movie' },
  { key: 'Série', value: 'show' },
  { key: 'Jogo', value: 'game' },
];

const isContentTypeValid = (contentType) => {
  return !!contentTypeList.find((e) => e.value === contentType);
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
    return content.movies ? content.movies : [];
  }
  if (typeFilter === 'show') {
    return content.shows ? content.shows : [];
  }
  if (typeFilter === 'game') {
    return content.games ? content.games : [];
  }
};

const ShowList = () => {
  const { id: listId } = useParams();
  const location = useLocation();
  const queryParams = useMemo(
    () => queryString.parse(location.search),
    [location]
  );
  const { type: contentType = 'all' } = queryParams;
  const history = useHistory();

  const { contentWrapperRef } = useContext(LayoutContext);
  const { userId, authenticated } = useContext(AuthContext);
  const {
    userProfile: { is_active: isUserActive },
  } = useContext(ProfileContext);
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
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [liked, setLiked] = useState();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const mounted = useRef();
  const source = useRef();

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef]);

  const clearState = () => {
    setLoadingError(false);
    setDenyAccess(false);
    setContentList({});
    setCreatedAt(null);
    setContent([]);
    setContentTypes([]);
    setShowTypeOptions(false);
    setLiked(null);
    setShowDeleteDialog(false);
  };

  useEffect(() => {
    if (!isContentTypeValid(contentType)) {
      history.replace(
        setQueryParamAndGetNewUrl(location.pathname, queryParams, 'type', 'all')
      );
    }
  }, [contentType, history, location, queryParams]);

  useEffect(() => {
    mounted.current = true;
    source.current = axios.CancelToken.source();

    (async () => {
      try {
        setLoading(true);
        clearState();
        const { data } = await justChooseApi.get(`/contentlists/${listId}`, {
          cancelToken: source.current.token,
        });
        setContentList(data);
        setCreatedAt(new Date(data.created_at));
        setContentTypes(['all', ...data.content_types]);
        if (authenticated && isUserActive) {
          const {
            data: { like },
          } = await justChooseApi.get(`/contentlists/${listId}/like`, {
            cancelToken: source.current.token,
          });
          setLiked(like);
        }
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        setLoading(false);
        if (error.response && error.response.status === 400) {
          setLoadingError(true);
        }
        if (error.response && error.response.status === 403) {
          setDenyAccess(true);
        }
      }
    })();

    return () => {
      mounted.current = false;
      source.current.cancel();
    };
  }, [listId, authenticated, isUserActive]);

  useEffect(() => {
    if (JSON.stringify(contentList) !== '{}') {
      setContent(
        getFilteredContent(
          contentList.content,
          contentList.content_types,
          contentType
        )
      );
    }
  }, [contentList, contentType]);

  const handleLike = async () => {
    if (!authenticated || !isUserActive) {
      return;
    }
    try {
      if (!liked) {
        await justChooseApi.post(`/contentlists/${listId}/like`);
        if (mounted.current) {
          setContentList((prevState) => ({
            ...prevState,
            likes: prevState.likes + 1,
          }));
        }
      }
      if (liked) {
        await justChooseApi.delete(`/contentlists/${listId}/like`);
        if (mounted.current) {
          setContentList((prevState) => ({
            ...prevState,
            likes: prevState.likes - 1,
          }));
        }
      }
      if (mounted.current) {
        setLiked((prevState) => !prevState);
      }
    } catch (error) {}
  };

  const handleFork = async () => {
    if (!authenticated || !isUserActive) {
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
      if (mounted.current) {
        setLoading(false);
      }
      setMessage('Lista criada com sucesso.');
      setSeverity('success');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      history.push(`/lists/${data.forked_list_id}`);
    } catch (error) {
      if (mounted.current) {
        setLoading(false);
      }
      setMessage('Não foi possível criar a lista. Por favor, tente novamente.');
      setSeverity('error');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    }
  };

  const handleDelete = async () => {
    if (!authenticated || !isUserActive) {
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

  const handleSelectContentType = (ct) => {
    setShowTypeOptions(false);
    if (contentType !== ct) {
      history.push(
        setQueryParamAndGetNewUrl(location.pathname, queryParams, 'type', ct)
      );
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
                  authenticated
                    ? isUserActive
                      ? liked
                        ? 'Não gostei'
                        : 'Gostei'
                      : 'Confirme seu e-mail para deixar sua reação'
                    : 'Faça login para deixar sua reação'
                }
                onClick={handleLike}
              >
                {!liked && (
                  <FaRegHeart size={'25px'} style={{ flexShrink: 0 }} />
                )}
                {liked && <FaHeart size={'25px'} style={{ flexShrink: 0 }} />}
                <span>{formatCount(contentList.likes)}</span>
              </HeaderButton>
              <HeaderButton
                title={
                  authenticated
                    ? isUserActive
                      ? 'Criar uma cópia da lista para sua conta'
                      : 'Confirme seu e-mail para criar uma cópia da lista'
                    : 'Faça login para criar uma cópia da lista'
                }
                onClick={handleFork}
              >
                <BiGitRepoForked size={'25px'} style={{ flexShrink: 0 }} />
                <span>{formatCount(contentList.forks)}</span>
              </HeaderButton>
            </div>
            {userId === contentList.user_id && (
              <div>
                <Link to={`/lists/${listId}/poll`} tabIndex="-1">
                  <HeaderButton title="Criar uma votação a partir da lista">
                    <FaVoteYea
                      size={'25px'}
                      style={{ flexShrink: 0, margin: '0 5px' }}
                    />
                  </HeaderButton>
                </Link>
                <Link to={`/lists/${listId}/update`} tabIndex="-1">
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
          <CreatedAt>
            <span>Criada em</span>&nbsp;
            {createdAt
              ? `${createdAt.getDate()}  de ${getMonth(
                  createdAt.getMonth()
                )} de ${createdAt.getFullYear()}`
              : '-'}
            &nbsp;
          </CreatedAt>
          <CreatedBy>
            <span>por</span>&nbsp;
            <Link to={`/users/${contentList.user_id}`}>
              <ProfileImageWrapper>
                <img
                  src={contentList.profile_image_url}
                  alt=""
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </ProfileImageWrapper>
              &nbsp;
              {contentList.user_name}&nbsp;
            </Link>
          </CreatedBy>
        </ListInfo>
        <Description>{contentList.description}</Description>
        <Filters>
          {contentTypes.length > 2 && (
            <>
              <label>Tipo</label>
              <SingleOptionSelect
                label={
                  !contentType || !contentTypes.find((ct) => ct === contentType)
                    ? 'Selecionar'
                    : contentTypeList.find((e) => e.value === contentType).key
                }
                dropDownAlign="center"
                show={showTypeOptions}
                setShow={setShowTypeOptions}
                width="85px"
                background={colors['background-600']}
                hover={colors['background-700']}
              >
                <TypeOptions>
                  {contentTypes.map((ct, i) => (
                    <Option
                      key={`typeFilter${i}`}
                      onClick={() => handleSelectContentType(ct)}
                    >
                      {contentTypeList.find((e) => e.value === ct).key}
                    </Option>
                  ))}
                </TypeOptions>
              </SingleOptionSelect>
            </>
          )}
        </Filters>
      </Header>
      <Main>
        {content.length === 0 && (
          <Message>
            Esta lista não apresenta nehum conteúdo do tipo{' '}
            {contentTypeList
              .find((e) => e.value === contentType)
              .key.toLowerCase()}
            .
          </Message>
        )}
        {content.length > 0 && <ContentGrid content={content} />}
      </Main>
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
