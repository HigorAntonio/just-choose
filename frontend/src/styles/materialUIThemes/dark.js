import { createMuiTheme } from '@material-ui/core';

import dark from '../themes/dark';

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
      color: dark.colors.text,
      fontWeight: 'bold',
    },
    colorInherit: {
      color: dark.colors.text,
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
      border: `2px solid ${dark.colors['background-400']}`,
      borderRadius: '5px',
      background: dark.colors['background-400'],
      transition: 'border 0.3s',
      '&:hover': {
        border: `2px solid ${dark.colors.gray}`,
      },
      '&$focused': {
        border: `2px solid ${dark.colors['primary-400']}`,
      },
    },
    input: {
      padding: '5px 0 5px 5px',
      color: dark.colors.text,
    },
  },
  MuiIconButton: {
    root: {
      borderRadius: '5px',
      padding: '5px',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
  MuiSvgIcon: {
    root: {
      fill: dark.colors.text,
    },
  },
  MuiPaper: {
    root: {
      backgroundColor: dark.colors['background-100'],
    },
  },
  MuiPickersCalendarHeader: {
    iconButton: {
      backgroundColor: dark.colors['background-100'],
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
    dayLabel: {
      color: dark.colors['dark-gray'],
    },
  },
  MuiPickersDay: {
    daySelected: {
      backgroundColor: dark.colors['primary-400'],
      '&:hover': {
        backgroundColor: dark.colors['primary-500'],
      },
    },
  },
  MuiSlider: {
    root: {
      width: '250px',
    },
    rail: {
      color: dark.colors['primary-400'],
    },
    track: {
      color: dark.colors['primary-400'],
    },
    thumb: {
      color: dark.colors['primary-400'],
    },
  },
  MuiTooltip: {
    tooltip: {
      backgroundColor: dark.colors['primary-400'],
    },
    arrow: {
      color: dark.colors['primary-400'],
    },
  },
  MuiSkeleton: {
    root: {
      backgroundColor: 'rgba(255, 255, 255, 0.11)',
    },
  },
};

export default theme;
