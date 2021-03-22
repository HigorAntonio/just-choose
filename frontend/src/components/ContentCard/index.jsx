import React from 'react';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';

import { Container, Poster } from './styles';

const ContentCard = ({ src, alt, title, check, click }) => {
  const handleClick = () => {
    click();
  };

  return (
    <Container title={title}>
      <Poster src={src} alt="" />
      <div onClick={handleClick}>
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
