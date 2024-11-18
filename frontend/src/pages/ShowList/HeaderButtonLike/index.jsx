import React, { useContext } from 'react';
import { useQueryClient } from 'react-query';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import { AlertContext } from '../../../context/AlertContext';

import justChooseApi from '../../../services/justChooseApi';
import useQuery from '../../../hooks/useQuery';
import formatCount from '../../../utils/formatCount';

import { HeaderButton } from '../styles';

const HeaderButtonLike = ({ authentication, listId, contentList }) => {
  const queryClient = useQueryClient();

  const {
    setMessage,
    setSeverity,
    setShow: setShowAlert,
    duration: alertTimeout,
    setDuration: setAlertTimeout,
  } = useContext(AlertContext);

  const { data: liked } = useQuery(
    ['showlist/like', { listId, authentication }],
    async () => {
      const response = await justChooseApi.get(`/contentlists/${listId}/like`);
      return response.data.like;
    },
    { retry: false, enabled: !!authentication?.profile?.is_active }
  );

  const handleLike = async () => {
    if (!authentication) {
      clearTimeout(alertTimeout);
      setMessage('Faça login para deixar sua reação.');
      setSeverity('error');
      setShowAlert(true);
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      return;
    }
    if (authentication?.profile?.is_active === false) {
      clearTimeout(alertTimeout);
      setMessage('Confirme seu e-mail para deixar sua reação.');
      setSeverity('error');
      setShowAlert(true);
      setAlertTimeout(setTimeout(() => setShowAlert(false), 4000));
      return;
    }
    try {
      if (!liked) {
        await justChooseApi.post(`/contentlists/${listId}/like`);
        queryClient.setQueryData(
          ['showlist/list', { listId, authentication }],
          (oldData) => ({ ...oldData, likes: oldData.likes + 1 })
        );
      }
      if (liked) {
        await justChooseApi.delete(`/contentlists/${listId}/like`);
        queryClient.setQueryData(
          ['showlist/list', { listId, authentication }],
          (oldData) => ({ ...oldData, likes: oldData.likes - 1 })
        );
      }
      queryClient.setQueryData(
        ['showlist/like', { listId, authentication }],
        (oldData) => !oldData
      );
    } catch (error) {}
  };

  return (
    <HeaderButton title={liked ? 'Não gostei' : 'Gostei'} onClick={handleLike}>
      {!liked && <FaRegHeart size={'25px'} style={{ flexShrink: 0 }} />}
      {liked && <FaHeart size={'25px'} style={{ flexShrink: 0 }} />}
      <span>{formatCount(contentList?.likes || 0)}</span>
    </HeaderButton>
  );
};

export default HeaderButtonLike;
