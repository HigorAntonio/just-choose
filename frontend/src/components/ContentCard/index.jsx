import React, { useState, useEffect } from 'react';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';
import { BsImage } from 'react-icons/bs';

import { Container, Poster } from './styles';

const ContentCard = ({ src, title, check, click }) => {
  const [error, setError] = useState(false);
  const handleClick = (e) => {
    click(e);
  };

  const handleOnPressEnter = (e) => {
    if (e.key === 'Enter') {
      click(e);
    }
  };

  useEffect(() => !src && setError(true), [src, setError]);

  return (
    <Container title={title}>
      <Poster src={src} alt="" onError={() => setError(true)} error={error} />
      {error && <BsImage size={'50%'} style={{ flexShrink: 0 }} />}
      <div
        className="check-box"
        onClick={handleClick}
        onKeyPress={handleOnPressEnter}
        tabIndex="-1"
        data-focusable
      >
        {check ? (
          <ImCheckboxChecked
            size={'1.5rem'}
            style={{ fill: '#fff', flexShrink: 0 }}
          />
        ) : (
          <ImCheckboxUnchecked
            size={'1.5rem'}
            style={{ fill: '#fff', flexShrink: 0 }}
          />
        )}
      </div>
    </Container>
  );
};

export default ContentCard;
