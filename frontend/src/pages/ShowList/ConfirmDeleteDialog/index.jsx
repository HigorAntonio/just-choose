import React, { useState, useEffect } from 'react';

import { Container, Header, Main } from './styles';

const isConfirmationValid = (validValue, inputValue) => {
  return validValue === inputValue;
};

const ConfirmDeleteDialog = ({ createdBy, listTitle, handleDelete }) => {
  const [confirmation, setConfirmation] = useState('');
  const [disabledButton, setDisabledButton] = useState(true);

  const handleChange = (e) => {
    setConfirmation(e.target.value);
  };

  useEffect(() => {
    setDisabledButton(
      !isConfirmationValid(`${createdBy}/${listTitle}`, confirmation)
    );
  }, [confirmation, createdBy, listTitle]);

  const handleKeyPress = (e) => {
    if (
      e.key === 'Enter' &&
      e.target.value &&
      isConfirmationValid(`${createdBy}/${listTitle}`, confirmation)
    ) {
      handleDelete();
    }
  };

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
        <input
          type="text"
          autoFocus
          value={confirmation}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleDelete} disabled={disabledButton}>
          Eu entendo as consequências, excluir lista
        </button>
      </Main>
    </Container>
  );
};

export default ConfirmDeleteDialog;
