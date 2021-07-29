module.exports = {
  size1: '1200px',
  size2: '1290px',
  size3: '768px',
  size4: '475px',
  size5: '500px',
  size6: '1130px',
  size7: '1027px',
  size8: '640px',

  getInt: (size) => {
    return parseInt(size.slice(0, -2));
  },
};
