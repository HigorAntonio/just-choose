const isTypeValid = require('../utils/trending/isTypeValid');
const getContentLists = require('../utils/contentList/getContentLists');

module.exports = {
  async index(req, res) {
    try {
      const { page = 1, page_size: pageSize = 15, type } = req.query;

      const errors = [];

      if (isNaN(page)) {
        errors.push('O parâmetro page deve ser um número');
      } else if (page < 1) {
        errors.push('O parâmetro page inválido. Min 1');
      }
      if (isNaN(pageSize)) {
        errors.push('O parâmetro page_size deve ser um número');
      } else if (pageSize < 1 || pageSize > 100) {
        errors.push('Parâmetro page_size inválido. Min 1, Max 100');
      }
      if (type) {
        if (typeof type !== 'string') {
          errors.push('O parâmetro type deve ser uma string');
        } else if (!isTypeValid(type)) {
          errors.push('Parâmetro type, valor inválido');
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const { contentLists, count: contentListsCount } =
        !type || type === 'content_list'
          ? await getContentLists({
              pageSize,
              page,
              sortBy: `DATE_TRUNC('week', created_at) DESC, likes DESC`,
            })
          : { contentLists: [], count: 0 };

      const results = type ? [] : {};

      if (!type) {
        results.content_lists = {
          total_results: contentListsCount,
          results: contentLists,
        };
      }
      if (type === 'content_list') {
        results.push(...contentLists);
      }

      const totalResults = contentListsCount;
      const totalPages = Math.ceil(contentListsCount / pageSize);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(pageSize),
        total_pages: totalPages === 0 ? 1 : totalPages,
        total_results: totalResults,
        results,
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
