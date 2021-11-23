module.exports = {
  size1: '1199px', //usando na sidebar
  size2: '1886px', //usando no filtro de conteudo
  size3: '775px', //usando no filtro de conteudo
  size4: '1670px', //usando no filtro de conteudo
  size5: '1490px', //usando no filtro de conteudo

  getInt: (size) => {
    return parseInt(size.slice(0, -2));
  },
};
