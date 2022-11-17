import React, { useEffect, useRef, memo } from 'react';

import ContentCard from '../../../components/ContentCard';
import contentTypesUtil from '../../../utils/contentTypes';

import { Container, CardWrapper, Message } from './styles';

const ListPreview = ({ contentList = {}, setContentList, wrapperRef }) => {
  const containerRef = useRef();

  useEffect(() => {
    const handleKeydown = (e) => {
      if (document.hasFocus()) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
        }
        if (
          document.activeElement.hasAttribute('data-content-list-container')
        ) {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            if (
              document.activeElement
                .closest('[data-content-list-container]')
                .querySelectorAll('[data-focusable]')[0]
            ) {
              document.activeElement
                .closest('[data-content-list-container]')
                .querySelectorAll('[data-focusable]')[0]
                .focus();
            }
          }
        } else if (
          document.activeElement.closest('[data-content-list-container]') !=
          null
        ) {
          let activeElementIndex = [
            ...document.activeElement
              .closest('[data-content-list-container]')
              .querySelectorAll('[data-focusable]'),
          ].indexOf(document.activeElement);
          if (e.key === 'ArrowRight') {
            if (
              ++activeElementIndex <
              [
                ...document.activeElement
                  .closest('[data-content-list-container]')
                  .querySelectorAll('[data-focusable]'),
              ].length
            ) {
              [
                ...document.activeElement
                  .closest('[data-content-list-container]')
                  .querySelectorAll('[data-focusable]'),
              ][activeElementIndex].focus();
            }
          }
          if (e.key === 'ArrowLeft') {
            if (--activeElementIndex >= 0) {
              [
                ...document.activeElement
                  .closest('[data-content-list-container]')
                  .querySelectorAll('[data-focusable]'),
              ][activeElementIndex].focus();
            }
          }
        }
      }
    };

    containerRef.current.addEventListener('keydown', handleKeydown);
  }, []);

  // Quando a lista de conteudo muda move o scroll da contentList pro início
  useEffect(() => {
    wrapperRef.current.scrollTo(0, 0);
  }, [wrapperRef]);

  const addToContentList = (content) => {
    const { contentPlatformId, title, posterPath } = content;
    if (
      contentList.map((c) => c.content_platform_id).includes(contentPlatformId)
    ) {
      setContentList((prevState) =>
        prevState.filter((c) => c.content_platform_id !== contentPlatformId)
      );
    } else {
      setContentList((prevState) => [
        ...prevState,
        {
          content_platform_id: contentPlatformId,
          title,
          poster_path: posterPath,
          type: 'game',
        },
      ]);
    }
  };

  const isInContentList = (contentPlatformId) =>
    contentList.map((c) => c.content_platform_id).includes(contentPlatformId);

  return (
    <Container ref={containerRef} tabIndex="0" data-content-list-container>
      {contentList.length > 0 &&
        contentList.map((c, i) => {
          return (
            <CardWrapper key={c.content_platform_id}>
              <ContentCard
                src={contentTypesUtil.getPosterUrl(c)}
                title={c.title}
                click={() =>
                  addToContentList({
                    contentPlatformId: c.content_platform_id,
                    title: c.title,
                    posterPath: c.poster_path,
                  })
                }
                check={isInContentList(c.content_platform_id)}
              />
            </CardWrapper>
          );
        })}
      {!contentList.length && (
        <Message>Você não adicionou itens à lista</Message>
      )}
    </Container>
  );
};

export default memo(ListPreview);
