import React, { useState } from 'react';
import { GoSearch } from 'react-icons/go';

import SingleOptionSelect from '../../components/SingleOptionSelect';
import MovieFilters from '../../components/MovieFilters';

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
} from './styles';

const CreateMovieList = () => {
  const [contentType, setContentType] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
                {contentType === 'Filme' && <MovieFilters />}
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
            {/* <div>Content</div> */}
          </ContentList>
        </div>
      </Main>
    </Container>
  );
};

export default CreateMovieList;
