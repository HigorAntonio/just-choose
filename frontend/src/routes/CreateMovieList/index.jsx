import React from 'react';

import CustomSelect from '../../components/CustomSelect';
import CustomOption from '../../components/CustomOption';
import ContentProvider from '../../components/ContentProvider';
import DataPicker from '../../components/DataPicker';
import RangeSlider from '../../components/RangeSlider';

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
  DataPickerWrapper,
  RangeWrapper,
  Certification,
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
            <Filters>
              <label>Filtrar por</label>
              <CustomSelect label="Provedor" dropDownAlign="center">
                <ContentProvider>Google Play Movies</ContentProvider>
              </CustomSelect>
              <CustomSelect label="Gênero" dropDownAlign="center">
                <Genres>
                  <CustomOption>Ficção Científica</CustomOption>
                  <CustomOption>Ficção Científica</CustomOption>
                  <CustomOption>Ficção Científica</CustomOption>
                </Genres>
              </CustomSelect>
              <CustomSelect label="Data de lançamento" dropDownAlign="center">
                <ReleaseDate>
                  <div>
                    <span>de</span>
                    <DataPickerWrapper>
                      <DataPicker />
                    </DataPickerWrapper>
                  </div>
                  <div>
                    <span>até</span>
                    <DataPickerWrapper>
                      <DataPicker />
                    </DataPickerWrapper>
                  </div>
                </ReleaseDate>
              </CustomSelect>
              <CustomSelect
                label="Classificação indicativa"
                dropDownAlign="center"
              >
                <Certification>
                  <CustomOption>L</CustomOption>
                  <CustomOption>10</CustomOption>
                  <CustomOption>12</CustomOption>
                  <CustomOption>14</CustomOption>
                  <CustomOption>16</CustomOption>
                  <CustomOption>18</CustomOption>
                </Certification>
              </CustomSelect>
              <CustomSelect label="Pontuação do usuário" dropDownAlign="center">
                <RangeWrapper>
                  <span className="label-left">0</span>
                  <RangeSlider min={0} max={10} step={1} />
                  <span className="label-right">10</span>
                </RangeWrapper>
              </CustomSelect>
              <CustomSelect label="Duração" dropDownAlign="center">
                <RangeWrapper title="Duração em minutos">
                  <span className="label-left" title="0 minutos">
                    0
                  </span>
                  <RangeSlider min={0} max={400} step={1} />
                  <span className="label-right" title="400 minutos">
                    400
                  </span>
                </RangeWrapper>
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
