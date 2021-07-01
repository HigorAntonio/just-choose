import React, { useState, useEffect } from 'react';
import { BsImage } from 'react-icons/bs';

import { Container, Poster } from './styles';

const ContentCardSimple = ({ src, title }) => {
  const [error, setError] = useState(false);

  useEffect(() => !src && setError(true), [src, setError]);

  return (
    <Container title={title}>
      <Poster src={src} alt="" onError={() => setError(true)} error={error} />
      {error && <BsImage size={'50%'} style={{ flexShrink: 0 }} />}
    </Container>
  );
};

export default ContentCardSimple;
