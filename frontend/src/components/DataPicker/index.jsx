import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import ptBrLocale from 'date-fns/locale/pt-BR';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import theme from '../../styles/materialUITheme';

const DataPicker = () => {
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBrLocale}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          onChange={() => console.log()}
          KeyboardButtonProps={{
            'aria-label': 'mudar data',
            disableFocusRipple: true,
          }}
        />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default DataPicker;
