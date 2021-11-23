import React, { useState } from 'react';
import { ClickAwayListener } from '@material-ui/core';

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
    <ClickAwayListener onClickAway={handleMouseOut}>
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
    </ClickAwayListener>
  );
};

export default TooltipHover;
