const navOnAuxClick = (e, href) => {
  if (e.button === 1) {
    window.open(href);
  }
};

export default navOnAuxClick;
