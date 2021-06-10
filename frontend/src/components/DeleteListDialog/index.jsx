import React from 'react';

import { Container, Header, Main } from './styles';

const DeleteListDialog = ({ createdBy, listTitle }) => {
  return (
    <Container>
      <Header>
        <h1>Tem certeza que deseja excluir a lista?</h1>
      </Header>
      <Main>
        <div>
          Isso irá excluir permanentemente a lista <b>"{listTitle}"</b> e todas
          as votações e votos criados a partir dela.
        </div>
        <div>
          Por favor digite{' '}
          <b>
            "{createdBy}/{listTitle}"
          </b>{' '}
          para excluir.
        </div>
        <input type="text" autoFocus />
        <button>Eu entendo as consequências, excluir lista</button>
      </Main>
    </Container>
  );
};

export default DeleteListDialog;
