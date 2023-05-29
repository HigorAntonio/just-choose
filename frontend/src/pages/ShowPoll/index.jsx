import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import queryString from 'query-string';
import { ThemeContext } from 'styled-components';
import { IoMdListBox } from 'react-icons/io';
import { FaPlay } from 'react-icons/fa';
import { FaStop } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

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
import { formatCreationDate } from '../../utils/dataUtility';
import removeQueryParamAndGetNewUrl from '../../utils/removeQueryParamAndGetNewUrl';
import setQueryParamAndGetNewUrl from '../../utils/setQueryParamAndGetNewUrl';
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

const ShowPoll = () => {
  const { id: pollId } = useParams();
  const location = useLocation();
  const queryParams = useMemo(
    () => queryString.parse(location.search),
    [location]
  );
  const { type: contentType } = queryParams;
  const history = useHistory();

  const { authentication } = useContext(AuthContext);
  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);
  const { colors } = useContext(ThemeContext);
  const { contentWrapperRef } = useContext(LayoutContext);

  const queryClient = useQueryClient();

  const [showListOption, setShowListOption] = useState(false);
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
    ['showPoll/poll', { pollId, authentication }],
    async () => {
      const response = await justChooseApi.get(`/polls/${pollId}`);
      return {
        ...response.data,
        content_types: ['all', ...response.data.content_types],
      };
    },
    { retry: false }
  );

  const { data: isFollower } = useQuery(
    ['showPoll/isFollowing', { pollId, authentication }],
    async () => {
      const response = await justChooseApi.get(
        `/profiles/followers/${data?.profile_id}`
      );
      return response.data;
    },
    { retry: false, enabled: !!data && !!authentication }
  );

  useEffect(() => {
    if (data?.is_active === false) {
      setParams((prevState) => ({ ...prevState, sort_by: 'votes.desc' }));
    } else {
      setParams((prevState) => {
        delete prevState.sort_by;
        return { ...prevState };
      });
    }
  }, [data]);

  useEffect(() => {
    if (data?.content_lists[0]?.sharing_option === 'public') {
      setShowListOption(true);
    }
    if (data?.content_lists[0]?.sharing_option === 'followed_profiles') {
      setShowListOption(isFollower);
    }
    if (data?.content_lists[0]?.sharing_option === 'private') {
      setShowListOption(+authentication?.profile.id === +data?.profile_id);
    }
  }, [data, isFollower, authentication]);

  const handleActive = async () => {
    if (!authentication) {
      return;
    }
    try {
      clearTimeout(alertTimeout);
      setMessage(
        data?.is_active
          ? 'Por favor, aguarde. Fechando votação...'
          : 'Por favor, aguarde. Abrindo votação...'
      );
      setSeverity('info');
      setShowAlert(true);
      const formData = new FormData();
      formData.append('data', JSON.stringify({ isActive: !data?.is_active }));
      await justChooseApi({
        url: `/polls/${pollId}`,
        method: 'PUT',
        data: formData,
      });
      queryClient.invalidateQueries([
        'showPoll/poll',
        { pollId, authentication },
      ]);
      setMessage(
        data?.is_active
          ? 'Votação fechada com sucesso.'
          : 'Votação aberta com sucesso.'
      );
      setSeverity('success');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    } catch (error) {
      setMessage(
        data?.is_active
          ? 'Não foi possível fechar a votação. Por favor, tente novamente.'
          : 'Não foi possível abrir a votação. Por favor, tente novamente.'
      );
      setSeverity('error');
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
    }
  };

  const handleDelete = async () => {
    if (!authentication) {
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
              {showListOption && (
                <Link to={`/lists/${data?.content_lists[0]?.id}`} tabIndex="-1">
                  <HeaderButton title="Visualizar lista de conteúdo">
                    <IoMdListBox
                      size={'25px'}
                      style={{ flexShrink: 0, margin: '0 5px' }}
                    />
                  </HeaderButton>
                </Link>
              )}
              {+authentication?.profile.id === +data.profile_id && (
                <>
                  <HeaderButton
                    title={data?.is_active ? 'Fechar votação' : 'Abrir votação'}
                    onClick={handleActive}
                  >
                    {data?.is_active === false && (
                      <FaPlay
                        size={'25px'}
                        style={{ flexShrink: 0, margin: '0 5px' }}
                      />
                    )}
                    {data?.is_active && (
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
                  {data?.content_types.map((ct, i) => (
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
        <ContentGrid
          poll={data}
          authentication={authentication}
          params={params}
          contentType={contentType}
        />
      </Main>
      <Modal show={showDeleteDialog} setShow={setShowDeleteDialog}>
        <ConfirmDeleteDialog
          createdBy={data?.profile_display_name}
          pollTitle={data?.title}
          handleDelete={handleDelete}
        />
      </Modal>
    </Container>
  );
};

export default ShowPoll;
