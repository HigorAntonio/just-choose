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

const RangeSlider = ({ min, max, step }) => {
  const [value, setValue] = useState([min, max]);

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
        min={min}
        max={max}
        step={step}
      />
    </ThemeProvider>
  );
};

export default RangeSlider;
