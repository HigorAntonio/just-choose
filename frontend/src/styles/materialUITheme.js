import { createMuiTheme } from '@material-ui/core';

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
      color: '#efeff1',
      fontWeight: 'bold',
    },
    colorInherit: {
      color: '#efeff1',
    },
  },
  MuiInput: {
    root: {
      border: '2px solid #35495B',
      borderRadius: '5px',
      background: '#35495B',
      transition: 'border 0.3s',
      '&:hover': {
        border: '2px solid #C4C4C4',
      },
      '&$focused': {
        border: '2px solid #0F6BA8',
      },
    },
    input: {
      padding: '5px 0 5px 5px',
      color: '#efeff1',
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
      fill: '#efeff1',
    },
  },
  MuiPaper: {
    root: {
      backgroundColor: '#35495B',
    },
  },
  MuiPickersCalendarHeader: {
    iconButton: {
      backgroundColor: '#35495B',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
    dayLabel: {
      color: '#C4C4C4',
    },
  },
  MuiPickersDay: {
    daySelected: {
      backgroundColor: '#0F6BA8',
      '&:hover': {
        backgroundColor: '#0f6ba8d9',
      },
    },
  },
  MuiSlider: {
    root: {
      width: '250px',
    },
    rail: {
      color: '#0F6BA8',
    },
    track: {
      color: '#0F6BA8',
    },
    thumb: {
      color: '#0F6BA8',
    },
  },
  MuiTooltip: {
    tooltip: {
      backgroundColor: '#0F6BA8',
    },
    arrow: {
      color: '#0F6BA8',
    },
  },
};

export default theme;
