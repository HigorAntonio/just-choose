module.exports = {
  size1: '1200px',

  getInt: (size) => {
    return parseInt(size.slice(0, -2));
  },
};
