import React, { useContext, memo } from 'react';
import { ThemeContext } from 'styled-components';
import { ThemeProvider } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import ptBrLocale from 'date-fns/locale/pt-BR';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import mUILightTheme from '../../styles/materialUIThemes/light';
import mUIDarkTheme from '../../styles/materialUIThemes/dark';

const DataPicker = ({ value, setValue }) => {
  const { title: theme } = useContext(ThemeContext);

  return (
    <ThemeProvider theme={theme === 'light' ? mUILightTheme : mUIDarkTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBrLocale}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          value={value}
          onChange={(date) => setValue(date)}
          KeyboardButtonProps={{
            'aria-label': 'mudar data',
            disableFocusRipple: true,
          }}
        />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default memo(DataPicker);
