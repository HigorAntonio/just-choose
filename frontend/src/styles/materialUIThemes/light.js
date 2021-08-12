import { createMuiTheme } from '@material-ui/core';

import light from '../themes/light';

const theme = createMuiTheme({});

theme.props = {
  MuiInputLabel: {
    disabled: true,
  },
  MuiInput: {
    disableUnderline: true,
  },
  MuiIconButton: {
    disableFocusRipple: true,
    disableRipple: true,
  },
};

theme.overrides = {
  MuiTypography: {
    root: {
      color: light.colors.text,
      fontWeight: 'bold',
      fontSize: '1.4rem',
      fontFamily: `'Roboto', sans-serif`,
    },
    body1: {
      fontSize: '1.6rem',
      fontFamily: `'Roboto', sans-serif`,
    },
    body2: {
      fontSize: '1.4rem',
      fontFamily: `'Roboto', sans-serif`,
    },
    caption: {
      fontSize: '1.3rem',
      fontFamily: `'Roboto', sans-serif`,
    },
    colorInherit: {
      color: light.colors.text,
    },
  },
  MuiFormControl: {
    marginNormal: {
      marginTop: '0',
      marginBottom: '0',
    },
  },
  MuiInput: {
    root: {
      border: `2px solid ${light.colors['background-400']}`,
      borderRadius: '5px',
      background: `${light.colors['background-400']}`,
      transition: 'border 0.3s',
      '&:hover': {
        border: `2px solid ${light.colors.gray}`,
      },
      '&$focused': {
        border: `2px solid ${light.colors['primary-400']}`,
      },
    },
    input: {
      padding: '5px 0 5px 5px',
      color: light.colors.text,
      fontSize: '1.4rem',
      fontFamily: `'Roboto', sans-serif`,
    },
  },
  MuiIconButton: {
    root: {
      borderRadius: '5px',
      padding: '5px',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiSvgIcon: {
    root: {
      fill: light.colors.text,
      width: '25px',
      height: '25px',
    },
  },
  MuiPaper: {
    root: {
      backgroundColor: `${light.colors['background-100']}`,
    },
  },
  MuiPickersCalendarHeader: {
    iconButton: {
      backgroundColor: `${light.colors['background-100']}`,
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      },
    },
    dayLabel: {
      color: light.colors['dark-gray'],
    },
  },
  MuiPickersDay: {
    daySelected: {
      backgroundColor: `${light.colors['primary-400']}`,
      '&:hover': {
        backgroundColor: `${light.colors['primary-500']}`,
      },
    },
  },
  MuiSlider: {
    root: {
      width: '250px',
    },
    rail: {
      color: `${light.colors['primary-400']}`,
    },
    track: {
      color: `${light.colors['primary-400']}`,
    },
    thumb: {
      color: `${light.colors['primary-400']}`,
    },
  },
  MuiTooltip: {
    tooltip: {
      backgroundColor: `${light.colors['primary-400']}`,
      fontSize: '1.4rem',
      fontFamily: `'Roboto', sans-serif`,
    },
    arrow: {
      color: `${light.colors['primary-400']}`,
    },
  },
  MuiSkeleton: {
    root: {
      backgroundColor: 'rgba(0, 0, 0, 0.11)',
    },
  },
};

export default theme;
