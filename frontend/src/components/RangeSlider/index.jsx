import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';

import theme from '../../styles/materialUITheme';

const ValueLabelComponent = (props) => {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
};

const RangeSlider = () => {
  const [value, setValue] = useState([0, 10]);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        ValueLabelComponent={ValueLabelComponent}
        min={0}
        max={10}
        step={1}
      />
    </ThemeProvider>
  );
};

export default RangeSlider;
