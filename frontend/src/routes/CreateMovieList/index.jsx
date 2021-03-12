import React, { useState, useEffect } from 'react';
import { GoSearch } from 'react-icons/go';

import SingleOptionSelect from '../../components/SingleOptionSelect';
import MovieFilters from '../../components/MovieFilters';
import ContentCard from '../../components/ContentCard';

import justChooseApi from '../../apis/justChooseApi';

import {
  Container,
  Header,
  Main,
  LabelWrapper,
  InputWrapper,
  ThumbnailWrapper,
  ContentList,
  ContentListHeader,
  ContentTypes,
  Option,
  SearchWrapper,
  ContentListWrapper,
  ContentListBody,
} from './styles';

const CreateMovieList = () => {
  const [contentType, setContentType] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [configuration, setConfiguration] = useState({});
  const [content, setContent] = useState();

  useEffect(() => {
    if (contentType === 'Filme' || contentType === 'Série') {
      (async () => {
        try {
          const { data } = await justChooseApi('/configuration/tmdb');
          const poster_url = data.images.secure_base_url;
          setConfiguration((prevState) => ({ ...prevState, poster_url }));
        } catch (error) {}
      })();
    }
  }, [contentType, setConfiguration]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log(searchValue);
    }
  };

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
        <div className={!contentType ? null : 'content-list'}>
          <ContentList>
            <ContentListHeader>
              <div className="row">
                <div>
                  <label>Tipo de conteúdo</label>
                  <SingleOptionSelect
                    label={!contentType ? 'Selecionar' : contentType}
                    dropDownAlign="center"
                    show={showOptions}
                    setShow={setShowOptions}
                  >
                    <ContentTypes>
                      <Option
                        onClick={() => {
                          setContentType('Filme');
                          setShowOptions(false);
                        }}
                      >
                        Filme
                      </Option>
                      <Option
                        onClick={() => {
                          setContentType('Série');
                          setShowOptions(false);
                        }}
                      >
                        Série
                      </Option>
                      <Option
                        onClick={() => {
                          setContentType('Jogo');
                          setShowOptions(false);
                        }}
                      >
                        Jogo
                      </Option>
                    </ContentTypes>
                  </SingleOptionSelect>
                </div>
                {contentType === 'Filme' && (
                  <MovieFilters setContent={setContent} />
                )}
              </div>
              {contentType === 'Filme' && (
                <div className="row">
                  <SearchWrapper>
                    <GoSearch
                      size={15}
                      color="#efeff1"
                      style={{ flexShrink: 0 }}
                    />
                    <input
                      type="search"
                      id="search"
                      placeholder="Buscar"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </SearchWrapper>
                </div>
              )}
            </ContentListHeader>
            {content && (
              <ContentListWrapper>
                <ContentListBody
                  cardOrientation={
                    contentType === 'Jogo' ? 'horizontal' : 'vertical'
                  }
                >
                  {content.results.map((c) => (
                    <ContentCard
                      key={c.id}
                      src={`${configuration.poster_url}w342${c.poster_path}`}
                    />
                  ))}
                </ContentListBody>
              </ContentListWrapper>
            )}
          </ContentList>
        </div>
      </Main>
    </Container>
  );
};

export default CreateMovieList;
