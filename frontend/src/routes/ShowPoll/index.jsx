import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import { IoMdListBox } from 'react-icons/io';
import { FaPlay } from 'react-icons/fa';
import { FaStop } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { FaHashtag } from 'react-icons/fa';

import { AuthContext } from '../../context/AuthContext';
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

const formatVotes = (votes) => {
  if (votes < 1e3) return votes;
  if (votes >= 1e3 && votes < 1e6) return +(votes / 1e3).toFixed(1) + 'K';
  if (votes >= 1e6 && votes < 1e9) return +(votes / 1e6).toFixed(1) + 'M';
  if (votes >= 1e9 && votes < 1e12) return +(votes / 1e9).toFixed(1) + 'B';
  if (votes >= 1e12) return +(votes / 1e12).toFixed(1) + 'T';
};

const ShowPoll = ({ wrapperRef }) => {
  const { id: pollId } = useParams();
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
  const [poll, setPoll] = useState({});
  const [contentList, setContentList] = useState({});
  const [createdAt, setCreatedAt] = useState();
  const [content, setContent] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vote, setVote] = useState({});

  useEffect(() => console.log(content), [content]);

  useEffect(() => {
    // Posiciona o scroll no início da página
    wrapperRef.current.scrollTop = 0;
    wrapperRef.current.scrollLeft = 0;
  }, [wrapperRef]);

  const clearState = () => {
    setLoadingError(false);
    setDenyAccess(false);
    setPoll({});
    setContentList({});
    setCreatedAt(null);
    setContent([]);
    setContentTypes([]);
    setTypeFilter('all');
    setShowTypeOptions(false);
    setShowDeleteDialog(false);
  };

  const getPageData = useCallback(async () => {
    try {
      setLoading(true);
      clearState();
      const { data } = await justChooseApi.get(`/polls/${pollId}`);
      setPoll(data);
      setCreatedAt(new Date(data.created_at));
      if (JSON.stringify(data) !== '{}' && data.is_active) {
        const { data: list } = await justChooseApi.get(
          `/contentlists/${data.content_list_id}`
        );
        setContentList(list);
        setContentTypes(['all', ...list.content_types]);
        if (authenticated) {
          const { data: vote } = await justChooseApi.get(
            `/polls/${data.id}/votes`
          );
          if (vote) {
            setVote(vote);
          }
        }
      }
      if (JSON.stringify(data) !== '{}' && !data.is_active) {
        const { data: result } = await justChooseApi.get(
          `/polls/${data.id}/result`
        );
        setContent(result.results);
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
  }, [pollId, authenticated]);

  useEffect(() => {
    (async () => await getPageData())();
  }, [getPageData]);

  useEffect(() => {
    if (JSON.stringify(contentList) !== '{}' && poll.is_active) {
      setContent(
        getFilteredContent(
          contentList.content,
          contentList.content_types,
          typeFilter
        )
      );
    }
  }, [contentList, typeFilter, poll]);

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
      setPoll((prevState) => ({
        ...prevState,
        is_active: !prevState.is_active,
      }));
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
    if (!authenticated) {
      return;
    }
    try {
      e.preventDefault();
      // e.stopPropagation();
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
              <Link to={`/lists/${poll.content_list_id}`}>
                <HeaderButton title="Visualizar lista de conteúdo">
                  <IoMdListBox
                    size={'25px'}
                    style={{ flexShrink: 0, margin: '0 5px' }}
                  />
                </HeaderButton>
              </Link>
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
                  <Link to={`/polls/${pollId}/update`}>
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
            por <span className="created-by">{poll.user_name}</span>
          </span>
        </ListInfo>
        <Description>{poll.description}</Description>
        {poll.is_active && (
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
        )}
      </Header>
      <Main>
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
                const votes = `${formatVotes(c.votes)}`.replace('.', ',');
                return (
                  <div
                    className="row"
                    key={c.type + c.content_id}
                    onClick={() => {
                      window.open(href);
                    }}
                  >
                    <div className="bodyPosition">{i + 1}</div>
                    <div className="bodyTitle">
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
