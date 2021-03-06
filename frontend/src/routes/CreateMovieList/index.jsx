import React from 'react';

import MovieFilters from '../../components/MovieFilters';

import {
  Container,
  Header,
  Main,
  LabelWrapper,
  InputWrapper,
  ThumbnailWrapper,
  ContentList,
} from './styles';

const CreateMovieList = () => {
  return (
    <Container>
      <Header>
        <h1>Nova Lista</h1>
      </Header>
      <Main>
        <h3>Principal</h3>
        <div>
          <InputWrapper>
            <LabelWrapper>
              <label htmlFor="title">Título</label>
            </LabelWrapper>
            <input type="text" id="title" autoFocus />
          </InputWrapper>
          <InputWrapper>
            <LabelWrapper>
              <label htmlFor="description">Descrição</label>
            </LabelWrapper>
            <textarea id="description" cols="30" rows="10"></textarea>
          </InputWrapper>
        </div>
        <h3>Miniatura</h3>
        <div>
          <ThumbnailWrapper>
            <label htmlFor="thumbnail">Selecione uma imagem</label>
            <input type="file" id="thumbnail" accept="image/*" />
            <p>
              A imagem deve estar no formato JPEG, PNG ou GIF e não pode ter
              mais do que 2 MB.
            </p>
          </ThumbnailWrapper>
        </div>
        <h3>Conteúdo</h3>
        <div className="content-list">
          <ContentList>
            <MovieFilters />
            <div>Content</div>
          </ContentList>
        </div>
      </Main>
    </Container>
  );
};

export default CreateMovieList;
