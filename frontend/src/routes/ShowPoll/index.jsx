import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { ThemeContext } from 'styled-components';
import { IoMdListBox } from 'react-icons/io';
import { FaPlay } from 'react-icons/fa';
import { FaStop } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { FaHashtag } from 'react-icons/fa';

import { AuthContext } from '../../context/AuthContext';
import { ProfileContext } from '../../context/ProfileContext';
import { AlertContext } from '../../context/AlertContext';

import justChooseApi from '../../apis/justChooseApi';
import NotFound from '../../components/NotFound';
import AccessDenied from '../../components/AccessDenied';
import ContentGrid from '../../components/ContentGrid';
import ContentCardSimple from '../../components/ContentCardSimple';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import Modal from '../../components/Modal';
import DeletePollDialog from '../../components/DeletePollDialog';
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
  ResultContainer,
  ResultHeader,
  ResultBody,
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

const ShowPoll = ({ wrapperRef }) => {
  const { id: pollId } = useParams();
  const location = useLocation();
  const queryParams = useMemo(
    () => queryString.parse(location.search),
    [location]
  );
  const { type: contentType = 'all' } = queryParams;
  const history = useHistory();

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
  const [poll, setPoll] = useState({});
  const [createdAt, setCreatedAt] = useState();
  const [content, setContent] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [showListOption, setShowListOption] = useState(false);
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vote, setVote] = useState({});

  useEffect(() => {
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  }, [wrapperRef]);

  const clearState = () => {
    setLoadingError(false);
    setDenyAccess(false);
    setPoll({});
    setCreatedAt(null);
    setContent([]);
    setContentTypes([]);
    setShowListOption(false);
    setShowTypeOptions(false);
    setShowDeleteDialog(false);
    setVote({});
  };

  useEffect(() => {
    if (!isContentTypeValid(contentType)) {
      history.replace(
        setQueryParamAndGetNewUrl(location.pathname, queryParams, 'type', 'all')
      );
    }
  }, [contentType, history, location, queryParams]);

  const getPageData = useCallback(async () => {
    try {
      setLoading(true);
      clearState();
      const { data: pollData } = await justChooseApi.get(`/polls/${pollId}`);
      setPoll(pollData);
      setCreatedAt(new Date(pollData.created_at));
      if (pollData.content_types) {
        setContentTypes(['all', ...pollData.content_types]);
      }
      if (
        JSON.stringify(pollData) !== '{}' &&
        pollData.is_active &&
        authenticated
      ) {
        const { data: vote } = await justChooseApi.get(
          `/polls/${pollData.id}/votes`
        );
        if (vote) {
          setVote(vote);
        }
      }
      if (JSON.stringify(pollData) !== '{}' && !pollData.is_active) {
        setContent(pollData.result);
      }
      try {
        await justChooseApi.get(`/contentlists/${pollData.content_list_id}`);
        setShowListOption(true);
      } catch (error) {}
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
  }, [pollId, authenticated]);

  useEffect(() => {
    (async () => await getPageData())();
  }, [getPageData]);

  useEffect(() => {
    if (JSON.stringify(poll) !== '{}' && poll.is_active) {
      setContent(
        getFilteredContent(poll.content, poll.content_types, contentType)
      );
    }
  }, [poll, contentType]);

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
      await getPageData();
      setLoading(false);
      setMessage(
        poll.is_active
          ? 'Votação fechada com sucesso.'
          : 'Votação aberta com sucesso.'
      );
      setSeverity('success');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    } catch (error) {
      setLoading(false);
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
    if (!isUserActive) {
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
      setVote(content);
    } catch (error) {}
  };

  const handleSelectContentType = (ct) => {
    setShowTypeOptions(false);
    if (contentType !== ct) {
      history.push(
        setQueryParamAndGetNewUrl(location.pathname, queryParams, 'type', ct)
      );
    }
  };

  const handleContentEnterKey = (e, href) => {
    if (e.key === 'Enter') {
      window.open(href);
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
            <h1 title={poll.title}>{poll.title}</h1>
          </TitleWrapper>
          <HeaderButtons>
            <div>
              {showListOption && (
                <Link to={`/lists/${poll.content_list_id}`} tabIndex="-1">
                  <HeaderButton title="Visualizar lista de conteúdo">
                    <IoMdListBox
                      size={'25px'}
                      style={{ flexShrink: 0, margin: '0 5px' }}
                    />
                  </HeaderButton>
                </Link>
              )}
              {userId === poll.user_id && (
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
            {createdAt
              ? `${createdAt.getDate()}  de ${getMonth(
                  createdAt.getMonth()
                )} de ${createdAt.getFullYear()}`
              : '-'}
            &nbsp;
          </CreatedAt>
          <CreatedBy>
            <span>por</span>&nbsp;
            <Link to={`/users/${poll.user_id}`}>
              <ProfileImageWrapper>
                <img
                  src={poll.profile_image_url}
                  alt=""
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </ProfileImageWrapper>
              &nbsp;
              {poll.user_name}&nbsp;
            </Link>
          </CreatedBy>
        </ListInfo>
        <Description>{poll.description}</Description>
        {poll.is_active && (
          <Filters>
            {contentTypes.length > 2 && (
              <>
                <label>Tipo</label>
                <SingleOptionSelect
                  label={
                    !contentType ||
                    !contentTypes.find((ct) => ct === contentType)
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
        )}
      </Header>
      <Main>
        {poll.is_active && content.length === 0 && (
          <Message>
            Esta votação não apresenta nehum conteúdo do tipo{' '}
            {contentTypeList
              .find((e) => e.value === contentType)
              .key.toLowerCase()}
            .
          </Message>
        )}
        {poll.is_active && content.length > 0 && (
          <ContentGrid
            content={content}
            checkbox
            checkboxcheck={(c) =>
              vote.content_id === c.content_id && vote.type === c.type
            }
            checkboxclick={handleVote}
          />
        )}
        {!poll.is_active && content.length > 0 && (
          <ResultContainer>
            <ResultHeader>
              <div className="headerPosition">
                <h2>
                  <FaHashtag
                    size={'20px'}
                    style={{ flexShrink: 0, margin: '0 5px' }}
                  />
                </h2>
              </div>
              <div className="headerTitle">
                <h2>Título</h2>
              </div>
              <div className="headerVotes">
                <h2>Votos</h2>
              </div>
            </ResultHeader>
            <ResultBody>
              {content.map((c, i) => {
                const src =
                  c.type === 'game'
                    ? c.poster_path &&
                      c.poster_path.replace(
                        'https://media.rawg.io/media',
                        'https://media.rawg.io/media/resize/420/-'
                      )
                    : `${process.env.REACT_APP_TMDB_POSTER_URL}w185${c.poster_path}`;
                const href = `${getContentBaseUrl(c.type)}/${
                  c.content_platform_id
                }`;
                const votes = formatCount(c.votes);
                return (
                  <div
                    className="row"
                    key={c.type + c.content_id}
                    onClick={() => {
                      window.open(href);
                    }}
                  >
                    <div className="bodyPosition">{i + 1}</div>
                    <div
                      className="bodyTitle"
                      onKeyPress={(e) => handleContentEnterKey(e, href)}
                      tabIndex="0"
                    >
                      <div className="posterWrapper">
                        <ContentCardSimple src={src} title={c.title} />
                      </div>
                      <div className="titleWrapper">
                        <div className="titleText">{c.title}</div>
                      </div>
                    </div>
                    <div
                      className="bodyVotes"
                      title={c.votes !== votes ? c.votes : ''}
                    >
                      {votes}
                    </div>
                  </div>
                );
              })}
            </ResultBody>
          </ResultContainer>
        )}
      </Main>
      <Modal show={showDeleteDialog} setShow={setShowDeleteDialog}>
        <DeletePollDialog
          createdBy={poll.user_name}
          pollTitle={poll.title}
          handleDelete={handleDelete}
        />
      </Modal>
    </Container>
  );
};

export default ShowPoll;
