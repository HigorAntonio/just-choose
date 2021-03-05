import React, { useState, useEffect } from 'react';

import CustomSelect from '../../components/CustomSelect';
import CustomOption from '../../components/CustomOption';
import ContentProvider from '../../components/ContentProvider';
import DataPicker from '../../components/DataPicker';
import RangeSlider from '../../components/RangeSlider';
import justChooseApi from '../../apis/justChooseApi';

import {
  Container,
  Header,
  Main,
  LabelWrapper,
  InputWrapper,
  ThumbnailWrapper,
  ContentList,
  Filters,
  Providers,
  Genres,
  ReleaseDate,
  DataPickerWrapper,
  RangeWrapper,
  Certification,
} from './styles';

const compareCertifications = (a, b) => {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
};

const CreateMovieList = () => {
  const [movieProviders, setMovieProviders] = useState();
  const [movieGenres, setMovieGenres] = useState();
  const [movieCertifications, setMovieCertifications] = useState();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await justChooseApi.get('/movies/watch_providers');
        setMovieProviders(data);
      } catch (error) {}
      try {
        const { data } = await justChooseApi.get('/movies/genres');
        setMovieGenres(data.genres);
      } catch (error) {}
      try {
        const { data } = await justChooseApi.get('/movies/certifications');
        setMovieCertifications(
          data.certifications['BR'].sort(compareCertifications)
        );
      } catch (error) {}
    })();
  }, [setMovieProviders]);

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
                <Providers>
                  {movieProviders &&
                    movieProviders.map((p) => (
                      <ContentProvider key={p.id}>{p.name}</ContentProvider>
                    ))}
                </Providers>
              </CustomSelect>
              <CustomSelect label="Gênero" dropDownAlign="center">
                <Genres>
                  {movieGenres &&
                    movieGenres.map((g) => (
                      <CustomOption key={g.id}>{g.name}</CustomOption>
                    ))}
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
                  {movieCertifications &&
                    movieCertifications.map((c) => (
                      <CustomOption key={c.order}>
                        {c.certification}
                      </CustomOption>
                    ))}
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
