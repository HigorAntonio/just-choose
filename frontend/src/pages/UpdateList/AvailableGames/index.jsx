import React, { useEffect, useContext, useRef, useCallback, memo } from 'react';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import ContentCard from '../../../components/ContentCard';
import useInfiniteQuery from '../../../hooks/useInfiniteQuery';
import mUILightTheme from '../../../styles/materialUIThemes/light';
import mUIDarkTheme from '../../../styles/materialUIThemes/dark';
import justChooseApi from '../../../services/justChooseApi';

import { Container, CardWrapper, SkeletonWrapper } from './styles';

const AvailableGames = ({
  params,
  contentList = {},
  setContentList,
  wrapperRef,
  showSkeleton = true,
}) => {
  const { title: theme } = useContext(ThemeContext);
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

  const getAvailableGames = useCallback(
    async ({ pageParam = 1 }) => {
      const response = await justChooseApi.get('/games', {
        params: { ...params, page: pageParam },
      });
      return response.data;
    },
    [params]
  );

  const { isFetching, isFetchingNextPage, data, lastElementRef } =
    useInfiniteQuery(['updateList/availableGames', params], getAvailableGames, {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.next ? pages.length + 1 : undefined;
      },
    });

  // Quando a lista de conteudo muda move o scroll da contentList pro início
  useEffect(() => {
    wrapperRef.current.scrollTo(0, 0);
  }, [wrapperRef, params]);

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
      {data?.pages.map((page) => {
        return page.results.map((content, i) => {
          const cardWrapperProps =
            page.results.length === i + 1 ? { ref: lastElementRef } : {};
          return (
            <CardWrapper key={content.id} {...cardWrapperProps}>
              <ContentCard
                src={
                  content.background_image
                    ? content.background_image.replace(
                        'https://media.rawg.io/media',
                        'https://media.rawg.io/media/resize/420/-'
                      )
                    : ''
                }
                title={content.name}
                click={() =>
                  addToContentList({
                    contentPlatformId: content.id,
                    title: content.name,
                    posterPath: `${content.background_image}`,
                  })
                }
                check={isInContentList(content.id)}
              />
            </CardWrapper>
          );
        });
      })}
      {showSkeleton &&
        (isFetching || isFetchingNextPage) &&
        [...new Array(30).keys()].map((_, i) => (
          <SkeletonWrapper key={i}>
            <ThemeProvider
              theme={theme === 'light' ? mUILightTheme : mUIDarkTheme}
            >
              <Skeleton
                variant="rect"
                width={'100%'}
                height={'100%'}
                style={{ position: 'absolute', top: '0', left: '0' }}
              />
            </ThemeProvider>
          </SkeletonWrapper>
        ))}
    </Container>
  );
};

export default memo(AvailableGames);
