import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import MuiSkeleton from '@material-ui/lab/Skeleton';

import mUILightTheme from '../../../styles/materialUIThemes/light';
import mUIDarkTheme from '../../../styles/materialUIThemes/dark';

import {
  Container,
  Header,
  HeaderRow,
  ListInfo,
  Description,
  Main,
  ContentListContainer,
} from './styles';

const Skeleton = () => {
  const { title: theme } = useContext(ThemeContext);

  return (
    <ThemeProvider theme={theme === 'light' ? mUILightTheme : mUIDarkTheme}>
      <Container>
        <Header>
          <HeaderRow>
            <MuiSkeleton variant="rect" width={'50%'} height={'85px'} />
            <MuiSkeleton variant="rect" width={'20%'} height={'51px'} />
          </HeaderRow>
          <ListInfo>
            <MuiSkeleton variant="rect" width={'25%'} height={'19px'} />
          </ListInfo>
          <Description>
            <MuiSkeleton variant="rect" width={'100%'} height={'75px'} />
          </Description>
        </Header>
        <Main>
          <ContentListContainer>
            {[...Array(30).keys()].map((c) => (
              <div key={c} className="cardWrapper">
                <MuiSkeleton variant="rect" width={'100%'} height={'100%'} />
              </div>
            ))}
          </ContentListContainer>
        </Main>
      </Container>
    </ThemeProvider>
  );
};

export default Skeleton;
