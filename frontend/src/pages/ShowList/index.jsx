import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import { ThemeContext } from 'styled-components';
import { FaHeart, FaRegHeart, FaVoteYea, FaTrash } from 'react-icons/fa';
import { BiGitRepoForked } from 'react-icons/bi';
import { MdSettings } from 'react-icons/md';

import { LayoutContext } from '../../context/LayoutContext';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

import justChooseApi from '../../services/justChooseApi';
import NotFound from '../../components/NotFound';
import SomethingWentWrong from '../../components/SomethingWentWrong';
import NoContent from './NoContent';
import AccessDenied from '../../components/AccessDenied';
import InfinityLoadContentGrid from '../../components/InfinityLoadContentGrid';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import Modal from '../../components/Modal';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import Skeleton from './Skeleton';
import contentTypesUtility from '../../utils/contentTypes';
import formatCount from '../../utils/formatCount';
import { formatCreationDate } from '../../utils/dataUtility';
import removeQueryParamAndGetNewUrl from '../../utils/removeQueryParamAndGetNewUrl';
import setQueryParamAndGetNewUrl from '../../utils/setQueryParamAndGetNewUrl';
import useInfiniteQuery from '../../hooks/useInfiniteQuery';

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
  ProfileImage,
  Description,
  Filters,
  TypeOptions,
  Option,
  Main,
} from './styles';

const ShowList = () => {
  const { id: listId } = useParams();
  const location = useLocation();
  const queryParams = useMemo(
    () => queryString.parse(location.search),
    [location]
  );
  const { type: contentType } = queryParams;
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
  const { colors } = useContext(ThemeContext);

  const [contentList, setContentList] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [denyAccess, setDenyAccess] = useState(false);
  const [createdAt, setCreatedAt] = useState();
  const [contentTypes, setContentTypes] = useState([]);
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [liked, setLiked] = useState();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [params, setParams] = useState({ page_size: 30, type: contentType });

  const mounted = useRef();
  const source = useRef();

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef]);

  useEffect(() => {
    setParams((prevState) => ({ ...prevState, type: contentType }));
  }, [contentType]);

  const clearState = () => {
    setContentList({});
    setLoading(true);
    setLoadingError(false);
    setNotFound(false);
    setDenyAccess(false);
    setCreatedAt(null);
    setContentTypes([]);
    setShowTypeOptions(false);
    setLiked(null);
    setShowDeleteDialog(false);
  };

  useEffect(() => {
    if (
      typeof contentType !== 'undefined' &&
      !contentTypesUtility.isValid(contentType)
    ) {
      history.replace(
        removeQueryParamAndGetNewUrl(location.pathname, queryParams, 'type')
      );
    }
  }, [contentType, history, location, queryParams]);

  useEffect(() => {
    mounted.current = true;
    source.current = axios.CancelToken.source();

    (async () => {
      try {
        clearState();
        const { data } = await justChooseApi.get(`/contentlists/${listId}`, {
          cancelToken: source.current.token,
        });
        setContentList(data);
        setCreatedAt(new Date(data.created_at));
        if (data && data.content_types) {
          setContentTypes(['all', ...data.content_types]);
        }
        if (
          authentication &&
          authentication.profile &&
          authentication.profile.is_active
        ) {
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
  }, [listId, authentication]);

  const getListContent = useCallback(
    async ({ pageParam = 1 }) => {
      const response = await justChooseApi.get(
        `/contentlists/${listId}/content`,
        {
          params: { ...params, page: pageParam },
        }
      );
      return response.data;
    },
    [listId, params]
  );

  const { isFetching, isFetchingNextPage, data, lastElementRef } =
    useInfiniteQuery(['showList/getListContent', params], getListContent, {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.page < lastPage.total_pages
          ? pages.length + 1
          : undefined;
      },
    });

  const handleLike = async () => {
    if (
      !authentication ||
      (authentication &&
        authentication.profile &&
        authentication.profile.is_active === false)
    ) {
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
    if (
      !authentication ||
      (authentication &&
        authentication.profile &&
        authentication.profile.is_active === false)
    ) {
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
    if (
      !authentication ||
      (authentication &&
        authentication.profile &&
        authentication.profile.is_active === false)
    ) {
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
    if (
      ct === contentType ||
      (ct === 'all' && typeof contentType === 'undefined')
    )
      return;
    if (ct === 'all') {
      history.push(
        removeQueryParamAndGetNewUrl(location.pathname, queryParams, 'type')
      );
      return;
    }
    history.push(
      setQueryParamAndGetNewUrl(location.pathname, queryParams, 'type', ct)
    );
  };

  if (loading) {
    return <Skeleton />;
  }
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
        <HeaderRow>
          <TitleWrapper>
            <h1 title={contentList.title}>{contentList.title}</h1>
          </TitleWrapper>
          <HeaderButtons>
            <div>
              <HeaderButton
                title={
                  authentication
                    ? authentication &&
                      authentication.profile &&
                      authentication.profile.is_active
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
                  authentication
                    ? authentication &&
                      authentication.profile &&
                      authentication.profile.is_active
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
            {authentication &&
              authentication.profile.id === contentList.profile_id && (
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
            {createdAt ? formatCreationDate(createdAt) : '-'}
            &nbsp;
          </CreatedAt>
          <CreatedBy>
            <span>por</span>&nbsp;
            <Link to={`/profiles/${contentList.profile_name}`}>
              <ProfileImageWrapper>
                <ProfileImage
                  src={contentList.profile_image_url}
                  alt=""
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </ProfileImageWrapper>
              &nbsp;
              {contentList.profile_display_name}&nbsp;
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
                    ? 'Todos'
                    : contentTypesUtility.options.find(
                        (e) => e.value === contentType
                      ).key
                }
                dropDownAlign="center"
                show={showTypeOptions}
                setShow={setShowTypeOptions}
                background={colors['background-600']}
                hover={colors['background-700']}
              >
                <TypeOptions>
                  {contentTypes.map((ct, i) => (
                    <Option
                      key={`typeFilter${i}`}
                      onClick={() => handleSelectContentType(ct)}
                    >
                      {
                        contentTypesUtility.options.find((e) => e.value === ct)
                          .key
                      }
                    </Option>
                  ))}
                </TypeOptions>
              </SingleOptionSelect>
            </>
          )}
        </Filters>
      </Header>
      <Main>
        {data?.pages[0]?.total_results === 0 && (
          <NoContent
            type={
              contentType
                ? contentTypesUtility.options
                    .find((e) => e.value === contentType)
                    .key.toLowerCase()
                : ''
            }
          />
        )}
        <InfinityLoadContentGrid
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          data={data}
          lastElementRef={lastElementRef}
        />
      </Main>
      <Modal show={showDeleteDialog} setShow={setShowDeleteDialog}>
        <ConfirmDeleteDialog
          createdBy={contentList.profile_display_name}
          listTitle={contentList.title}
          handleDelete={handleDelete}
        />
      </Modal>
    </Container>
  );
};

export default ShowList;
