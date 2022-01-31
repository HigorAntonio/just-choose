import React, { useState, useEffect } from 'react';

import { Container, Header, Main } from './styles';

const isConfirmationValid = (validValue, inputValue) => {
  return validValue === inputValue;
};

const ConfirmDeleteDialog = ({ createdBy, pollTitle, handleDelete }) => {
  const [confirmation, setConfirmation] = useState('');
  const [disabledButton, setDisabledButton] = useState(true);

  const handleChange = (e) => {
    setConfirmation(e.target.value);
  };

  useEffect(() => {
    setDisabledButton(
      !isConfirmationValid(`${createdBy}/${pollTitle}`, confirmation)
    );
  }, [confirmation, createdBy, pollTitle]);

  const handleKeyPress = (e) => {
    if (
      e.key === 'Enter' &&
      e.target.value &&
      isConfirmationValid(`${createdBy}/${pollTitle}`, confirmation)
    ) {
      handleDelete();
    }
  };

  return (
    <Container>
      <Header>
        <h1>Tem certeza que deseja excluir a votação?</h1>
      </Header>
      <Main>
        <div>
          Isso irá excluir permanentemente a votação <b>"{pollTitle}"</b>.
        </div>
        <div>
          Por favor digite{' '}
          <b>
            "{createdBy}/{pollTitle}"
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
          Eu entendo as consequências, excluir votação
        </button>
      </Main>
    </Container>
  );
};

export default ConfirmDeleteDialog;
