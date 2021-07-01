import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';

import mUILightTheme from '../../styles/materialUIThemes/light';
import mUIDarkTheme from '../../styles/materialUIThemes/dark';

const ValueLabelComponent = ({ children, open, value }) => {
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
};

const RangeSlider = ({ min, max, step, value, setValue }) => {
  const { title: theme } = useContext(ThemeContext);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme === 'light' ? mUILightTheme : mUIDarkTheme}>
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
