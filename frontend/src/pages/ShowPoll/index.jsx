import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string';
import { ThemeContext } from 'styled-components';
import { IoMdListBox } from 'react-icons/io';
import { FaPlay } from 'react-icons/fa';
import { FaStop } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

import { LayoutContext } from '../../context/LayoutContext';
import { AuthContext } from '../../context/AuthContext';
import { ProfileContext } from '../../context/ProfileContext';
import { AlertContext } from '../../context/AlertContext';

import justChooseApi from '../../services/justChooseApi';
import NotFound from '../../components/NotFound';
import SomethingWentWrong from '../../components/SomethingWentWrong';
import NoContent from './NoContent';
import Result from './Result';
import AccessDenied from '../../components/AccessDenied';
import InfinityLoadContentGrid from '../../components/InfinityLoadContentGrid';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import Modal from '../../components/Modal';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import Skeleton from './Skeleton';
import contentTypesUtility from '../../utils/contentTypes';
import { formatCreationDate } from '../../utils/dataUtility';
import removeQueryParamAndGetNewUrl from '../../utils/removeQueryParamAndGetNewUrl';
import setQueryParamAndGetNewUrl from '../../utils/setQueryParamAndGetNewUrl';
import useLoadMoreWhenLastElementIsOnScreen from '../../hooks/useLoadMoreWhenLastElementIsOnScreen';

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
} from './styles';

const ShowPoll = () => {
  const { id: pollId } = useParams();
  const location = useLocation();
  const queryParams = useMemo(
    () => queryString.parse(location.search),
    [location]
  );
  const { type: contentType } = queryParams;
  const history = useHistory();

  const { profileId, authenticated } = useContext(AuthContext);
  const {
    profile: { is_active: isProfileActive },
  } = useContext(ProfileContext);
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);
  const { colors } = useContext(ThemeContext);
  const { contentWrapperRef } = useContext(LayoutContext);

  const [poll, setPoll] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [denyAccess, setDenyAccess] = useState(false);
  const [createdAt, setCreatedAt] = useState();
  const [contentTypes, setContentTypes] = useState([]);
  const [showListOption, setShowListOption] = useState(false);
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vote, setVote] = useState({});
  const [params, setParams] = useState({ page_size: 30, type: contentType });

  const mounted = useRef();
  const source = useRef();

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef]);

  useEffect(() => {
    setParams((prevState) => ({ ...prevState, type: contentType }));
  }, [contentType]);

  useEffect(() => {
    if (poll && poll.is_active === false) {
      setParams((prevState) => ({ ...prevState, sort_by: 'votes.desc' }));
    } else {
      setParams((prevState) => {
        delete prevState.sort_by;
        return { ...prevState };
      });
    }
  }, [poll]);

  const clearState = () => {
    setPoll({});
    setLoading(true);
    setLoadingError(false);
    setNotFound(false);
    setDenyAccess(false);
    setCreatedAt(null);
    setContentTypes([]);
    setShowListOption(false);
    setShowTypeOptions(false);
    setShowDeleteDialog(false);
    setVote({});
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

  const getPageData = useCallback(async () => {
    try {
      clearState();
      const { data: pollData } = await justChooseApi.get(`/polls/${pollId}`, {
        cancelToken: source.current.token,
      });
      setPoll(pollData);
      setCreatedAt(new Date(pollData.created_at));
      if (pollData && pollData.content_types) {
        setContentTypes(['all', ...pollData.content_types]);
      }
      if (
        pollData &&
        JSON.stringify(pollData) !== '{}' &&
        pollData.is_active &&
        authenticated
      ) {
        const { data: vote } = await justChooseApi.get(
          `/polls/${pollData.id}/votes`,
          {
            cancelToken: source.current.token,
          }
        );
        if (vote) {
          setVote(vote);
        }
      }
      if (
        pollData &&
        pollData.content_lists[0] &&
        pollData.content_lists[0].sharing_option === 'public'
      ) {
        setShowListOption(true);
      }
      if (
        pollData &&
        pollData.content_lists[0] &&
        pollData.content_lists[0].sharing_option === 'followed_profiles' &&
        authenticated
      ) {
        try {
          const isFollower = await justChooseApi.get(
            `/profiles/followers/${pollData.profile_id}`,
            {
              cancelToken: source.current.token,
            }
          );
          setShowListOption(isFollower);
        } catch (error) {}
      }
      if (
        pollData &&
        pollData.content_lists[0] &&
        pollData.content_lists[0].sharing_option === 'private'
      ) {
        setShowListOption(
          parseInt(profileId) === parseInt(pollData.profile_id)
        );
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
  }, [pollId, authenticated, profileId]);

  useEffect(() => {
    mounted.current = true;
    source.current = axios.CancelToken.source();

    (async () => await getPageData())();

    return () => {
      mounted.current = false;
      source.current.cancel();
    };
  }, [getPageData]);

  const {
    loading: loadingContent,
    error: loadingContentError,
    content,
    lastElementRef: lastContentRef,
  } = useLoadMoreWhenLastElementIsOnScreen(`/polls/${pollId}/content`, params);

  const handleActive = async () => {
    if (!authenticated) {
      return;
    }
    try {
      setLoading(true);
      clearTimeout(alertTimeout);
      setMessage(
        poll.is_active
          ? 'Por favor, aguarde. Fechando votação...'
          : 'Por favor, aguarde. Abrindo votação...'
      );
      setSeverity('info');
      setShowAlert(true);
      const formData = new FormData();
      formData.append('data', JSON.stringify({ isActive: !poll.is_active }));
      await justChooseApi({
        url: `/polls/${pollId}`,
        method: 'PUT',
        data: formData,
      });
      if (mounted.current) {
        await getPageData();
        setLoading(false);
      }
      setMessage(
        poll.is_active
          ? 'Votação fechada com sucesso.'
          : 'Votação aberta com sucesso.'
      );
      setSeverity('success');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    } catch (error) {
      if (mounted.current) {
        setLoading(false);
      }
      setMessage(
        poll.is_active
          ? 'Não foi possível fechar a votação. Por favor, tente novamente.'
          : 'Não foi possível abrir a votação. Por favor, tente novamente.'
      );
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
      setMessage('Por favor, aguarde. Excluindo votação...');
      setSeverity('info');
      setShowAlert(true);
      await justChooseApi.delete(`/polls/${pollId}`);
      setMessage('Votação excluída com sucesso.');
      setSeverity('success');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      history.push('/');
    } catch (error) {
      setMessage(
        'Não foi possível excluir a votação. Por favor, tente novamente.'
      );
      setSeverity('error');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    }
  };

  const handleVote = async (e, content) => {
    e.preventDefault();
    if (!authenticated) {
      setShowDeleteDialog(false);
      clearTimeout(alertTimeout);
      setMessage('Faça login para poder votar.');
      setSeverity('info');
      setShowAlert(true);
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      return;
    }
    if (!isProfileActive) {
      setShowDeleteDialog(false);
      clearTimeout(alertTimeout);
      setMessage('Confirme seu e-mail para poder votar.');
      setSeverity('info');
      setShowAlert(true);
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      return;
    }
    try {
      if (vote && JSON.stringify(vote) !== '{}') {
        await justChooseApi.delete(`/polls/${pollId}/votes`);
      }

      if (
        mounted.current &&
        vote.content_id === content.content_id &&
        vote.type === content.type
      ) {
        setVote({});
        return;
      }

      await justChooseApi.post(`/polls/${pollId}/votes`, {
        contentId: content.content_id,
        type: content.type,
      });
      if (mounted.current) {
        setVote(content);
      }
    } catch (error) {}
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
            <h1 title={poll.title}>{poll.title}</h1>
          </TitleWrapper>
          <HeaderButtons>
            <div>
              {showListOption && (
                <Link to={`/lists/${poll.content_lists[0].id}`} tabIndex="-1">
                  <HeaderButton title="Visualizar lista de conteúdo">
                    <IoMdListBox
                      size={'25px'}
                      style={{ flexShrink: 0, margin: '0 5px' }}
                    />
                  </HeaderButton>
                </Link>
              )}
              {profileId === poll.profile_id && (
                <>
                  <HeaderButton
                    title={poll.is_active ? 'Fechar votação' : 'Abrir votação'}
                    onClick={handleActive}
                  >
                    {!poll.is_active && (
                      <FaPlay
                        size={'25px'}
                        style={{ flexShrink: 0, margin: '0 5px' }}
                      />
                    )}
                    {poll.is_active && (
                      <FaStop
                        size={'25px'}
                        style={{ flexShrink: 0, margin: '0 5px' }}
                      />
                    )}
                  </HeaderButton>
                  <Link to={`/polls/${pollId}/update`} tabIndex="-1">
                    <HeaderButton title="Editar votação">
                      <MdSettings
                        size={'25px'}
                        style={{ flexShrink: 0, margin: '0 5px' }}
                      />
                    </HeaderButton>
                  </Link>
                  <HeaderDeleteButton
                    title="Excluir votação"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <FaTrash
                      size={'25px'}
                      style={{ flexShrink: 0, margin: '0 5px' }}
                    />
                  </HeaderDeleteButton>
                </>
              )}
            </div>
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
            <Link to={`/profiles/${poll.profile_id}`}>
              <ProfileImageWrapper>
                <img
                  src={poll.profile_image_url}
                  alt=""
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </ProfileImageWrapper>
              &nbsp;
              {poll.profile_name}&nbsp;
            </Link>
          </CreatedBy>
        </ListInfo>
        <Description>{poll.description}</Description>
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
        {poll.is_active && content.length === 0 && (
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
        {poll.is_active && content.length > 0 && (
          <InfinityLoadContentGrid
            loading={loadingContent}
            error={loadingContentError}
            content={content}
            lastElementRef={lastContentRef}
            checkbox
            checkboxcheck={(c) =>
              vote.content_id === c.content_id && vote.type === c.type
            }
            checkboxclick={handleVote}
            tabIndex="-1"
          />
        )}
        {!poll.is_active && content.length > 0 && (
          <Result
            error={loadingContentError}
            content={content}
            lastElementRef={lastContentRef}
          />
        )}
      </Main>
      <Modal show={showDeleteDialog} setShow={setShowDeleteDialog}>
        <ConfirmDeleteDialog
          createdBy={poll.profile_name}
          pollTitle={poll.title}
          handleDelete={handleDelete}
        />
      </Modal>
    </Container>
  );
};

export default ShowPoll;
