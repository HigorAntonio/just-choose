import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import theme from '../../../styles/materialUITheme';

import {
  Container,
  Header,
  HeaderRow,
  ListInfo,
  Description,
  Main,
  ContentListContainer,
} from './styles';

const ShowListSkeleton = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header>
          <HeaderRow>
            <Skeleton variant="rect" width={'50%'} height={'85px'} />
            <Skeleton variant="rect" width={'20%'} height={'51px'} />
          </HeaderRow>
          <ListInfo>
            <Skeleton variant="rect" width={'25%'} height={'19px'} />
          </ListInfo>
          <Description>
            <Skeleton variant="rect" width={'100%'} height={'75px'} />
          </Description>
        </Header>
        <Main>
          <ContentListContainer>
            {[...Array(30).keys()].map((c) => (
              <div key={c} className="cardWrapper">
                <Skeleton variant="rect" width={'100%'} height={'100%'} />
              </div>
            ))}
          </ContentListContainer>
        </Main>
      </Container>
    </ThemeProvider>
  );
};

export default ShowListSkeleton;
