import React, { useState } from 'react';

import Tooltip from '../Tooltip';

import { Container } from './styles';

const TooltipHover = ({
  width,
  spacing,
  tooltipText,
  transitionDuration,
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseOver = () => {
    setShowTooltip(true);
  };

  const handleMouseOut = () => {
    setShowTooltip(false);
  };

  return (
    <Container onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      {children}
      <Tooltip
        width={width}
        spacing={spacing}
        show={showTooltip}
        transitionDuration={transitionDuration}
      >
        {tooltipText}
      </Tooltip>
    </Container>
  );
};

export default TooltipHover;
