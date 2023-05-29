import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { ThemeContext } from 'styled-components';
import { FaVoteYea, FaTrash } from 'react-icons/fa';
import { BiGitRepoForked } from 'react-icons/bi';
import { MdSettings } from 'react-icons/md';

import { LayoutContext } from '../../context/LayoutContext';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

import justChooseApi from '../../services/justChooseApi';
import NotFound from '../../components/NotFound';
import SomethingWentWrong from '../../components/SomethingWentWrong';
import AccessDenied from '../../components/AccessDenied';
import SingleOptionSelect from '../../components/SingleOptionSelect';
import Modal from '../../components/Modal';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import Skeleton from './Skeleton';
import contentTypesUtility from '../../utils/contentTypes';
import formatCount from '../../utils/formatCount';
import { formatCreationDate } from '../../utils/dataUtility';
import removeQueryParamAndGetNewUrl from '../../utils/removeQueryParamAndGetNewUrl';
import setQueryParamAndGetNewUrl from '../../utils/setQueryParamAndGetNewUrl';
import HeaderButtonLike from './HeaderButtonLike';
import ContentGrid from './ContentGrid';
import useQuery from '../../hooks/useQuery';

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

  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [params, setParams] = useState({ page_size: 30, type: contentType });

  useEffect(() => {
    contentWrapperRef.current.scrollTo(0, 0);
  }, [contentWrapperRef]);

  useEffect(() => {
    setParams((prevState) => ({ ...prevState, type: contentType }));
  }, [contentType]);

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

  const { isFetching, error, data } = useQuery(
    ['showlist/list', { listId, authentication }],
    async () => {
      const response = await justChooseApi.get(`/contentlists/${listId}`);
      return {
        ...response.data,
        content_types: ['all', ...response.data.content_types],
      };
    },
    { retry: false }
  );

  const handleFork = async () => {
    if (!authentication || authentication?.profile?.is_active === false) {
      return;
    }
    try {
      clearTimeout(alertTimeout);
      setMessage('Por favor, aguarde. Criando lista...');
      setSeverity('info');
      setShowAlert(true);
      const { data } = await justChooseApi.post(
        `/contentlists/${listId}/fork/`
      );
      setMessage('Lista criada com sucesso.');
      setSeverity('success');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      history.push(`/lists/${data.forked_list_id}`);
    } catch (error) {
      setMessage('Não foi possível criar a lista. Por favor, tente novamente.');
      setSeverity('error');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    }
  };

  const handleDelete = async () => {
    if (!authentication || authentication?.profile?.is_active === false) {
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

  const handleSelectContentType = (type) => {
    setShowTypeOptions(false);
    if (
      type === contentType ||
      (type === 'all' && typeof contentType === 'undefined')
    )
      return;
    if (type === 'all') {
      history.push(
        removeQueryParamAndGetNewUrl(location.pathname, queryParams, 'type')
      );
      return;
    }
    history.push(
      setQueryParamAndGetNewUrl(location.pathname, queryParams, 'type', type)
    );
  };

  if (isFetching) {
    return <Skeleton />;
  }
  if (error?.response?.status === 400) {
    return <NotFound />;
  }
  if (error?.response?.status === 403) {
    return <AccessDenied />;
  }
  if (error) {
    return <SomethingWentWrong />;
  }

  return (
    <Container>
      <Header>
        <HeaderRow>
          <TitleWrapper>
            <h1 title={data?.title}>{data?.title}</h1>
          </TitleWrapper>
          <HeaderButtons>
            <div>
              <HeaderButtonLike
                authentication={authentication}
                listId={listId}
                contentList={data}
              />
              <HeaderButton
                title={
                  authentication
                    ? authentication?.profile?.is_active
                      ? 'Criar uma cópia da lista para sua conta'
                      : 'Confirme seu e-mail para criar uma cópia da lista'
                    : 'Faça login para criar uma cópia da lista'
                }
                onClick={handleFork}
              >
                <BiGitRepoForked size={'25px'} style={{ flexShrink: 0 }} />
                <span>{formatCount(data?.forks)}</span>
              </HeaderButton>
            </div>
            {+authentication?.profile.id === +data?.profile_id && (
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
            {data?.created_at
              ? formatCreationDate(new Date(data?.created_at))
              : '-'}
            &nbsp;
          </CreatedAt>
          <CreatedBy>
            <span>por</span>&nbsp;
            <Link to={`/profiles/${data?.profile_name}`}>
              <ProfileImageWrapper>
                <ProfileImage
                  src={data?.profile_image_url}
                  alt=""
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </ProfileImageWrapper>
              &nbsp;
              {data?.profile_display_name}&nbsp;
            </Link>
          </CreatedBy>
        </ListInfo>
        <Description>{data?.description}</Description>
        <Filters>
          {data?.content_types.length > 2 && (
            <>
              <label>Tipo</label>
              <SingleOptionSelect
                label={
                  !contentType ||
                  !data?.content_types.find((type) => type === contentType)
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
                  {data?.content_types.map((type, i) => (
                    <Option
                      key={`typeFilter${i}`}
                      onClick={() => handleSelectContentType(type)}
                    >
                      {
                        contentTypesUtility.options.find(
                          (e) => e.value === type
                        ).key
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
        <ContentGrid
          listId={listId}
          params={params}
          contentType={contentType}
        />
      </Main>
      <Modal show={showDeleteDialog} setShow={setShowDeleteDialog}>
        <ConfirmDeleteDialog
          createdBy={data?.profile_display_name}
          listTitle={data?.title}
          handleDelete={handleDelete}
        />
      </Modal>
    </Container>
  );
};

export default ShowList;
