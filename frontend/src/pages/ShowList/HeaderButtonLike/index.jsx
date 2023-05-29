import React from 'react';
import { useQueryClient } from 'react-query';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import justChooseApi from '../../../services/justChooseApi';
import useQuery from '../../../hooks/useQuery';
import formatCount from '../../../utils/formatCount';

import { HeaderButton } from '../styles';

const HeaderButtonLike = ({ authentication, listId, contentList }) => {
  const queryClient = useQueryClient();

  const { data: liked } = useQuery(
    ['showlist/like', { listId, authentication }],
    async () => {
      const response = await justChooseApi.get(`/contentlists/${listId}/like`);
      return response.data.like;
    },
    { retry: false, enabled: !!authentication?.profile?.is_active }
  );

  const handleLike = async () => {
    if (!authentication || authentication?.profile?.is_active === false) {
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
    <HeaderButton
      title={
        authentication
          ? authentication?.profile?.is_active
            ? liked
              ? 'Não gostei'
              : 'Gostei'
            : 'Confirme seu e-mail para deixar sua reação'
          : 'Faça login para deixar sua reação'
      }
      onClick={handleLike}
    >
      {!liked && <FaRegHeart size={'25px'} style={{ flexShrink: 0 }} />}
      {liked && <FaHeart size={'25px'} style={{ flexShrink: 0 }} />}
      <span>{formatCount(contentList?.likes || 0)}</span>
    </HeaderButton>
  );
};

export default HeaderButtonLike;
