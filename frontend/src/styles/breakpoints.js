module.exports = {
  size1: '1200px',
  size2: '1290px',
  size3: '768px',
  size4: '475px',

  getInt: (size) => {
    return parseInt(size.slice(0, -2));
  },
};
