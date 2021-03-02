import React from 'react';

import CustomSelect from '../../components/CustomSelect';
import CustomOption from '../../components/CustomOption';
import ContentProvider from '../../components/ContentProvider';
import DataPicker from '../../components/DataPicker';

import {
  Container,
  Header,
  Main,
  LabelWrapper,
  InputWrapper,
  ThumbnailWrapper,
  ContentList,
  Filters,
  Genres,
  ReleaseDate,
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
        <div>
          <ContentList>
            <Filters>
              <label>Filtrar por</label>
              <CustomSelect label="Provedor">
                <ContentProvider>Google Play Movies</ContentProvider>
              </CustomSelect>
              <CustomSelect label="Gênero">
                <Genres>
                  <CustomOption>Ficção Científica</CustomOption>
                  <CustomOption>Ficção Científica</CustomOption>
                  <CustomOption>Ficção Científica</CustomOption>
                </Genres>
              </CustomSelect>
              <CustomSelect label="Data de lançamento">
                <ReleaseDate>
                  <DataPicker />
                </ReleaseDate>
              </CustomSelect>
            </Filters>
            <div>Content</div>
          </ContentList>
        </div>
      </Main>
    </Container>
  );
};

export default CreateMovieList;
