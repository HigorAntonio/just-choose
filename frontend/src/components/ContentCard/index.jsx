import React, { useState } from 'react';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';
import { BsImage } from 'react-icons/bs';

import { Container, Poster } from './styles';

const ContentCard = ({ src, title, check, click }) => {
  const [error, setError] = useState(false);
  const handleClick = () => {
    click();
  };

  return (
    <Container title={title}>
      <Poster src={src} alt="" onError={() => setError(true)} error={error} />
      {error && <BsImage size={'50%'} color="#fff" style={{ flexShrink: 0 }} />}
      <div className="check-box" onClick={handleClick}>
        {check ? (
          <ImCheckboxChecked size={15} color="#fff" style={{ flexShrink: 0 }} />
        ) : (
          <ImCheckboxUnchecked
            size={15}
            color="#fff"
            style={{ flexShrink: 0 }}
          />
        )}
      </div>
    </Container>
  );
};

export default ContentCard;
