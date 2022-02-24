const getContentOrderByQuery = require('../utils/contentList/getContentOrderByQuery');
const getContentList = require('../utils/contentList/getContentList');
const isUserFollowing = require('../utils/users/isUserFollowing');
const getContent = require('../utils/contentList/getContent');

module.exports = {
  async index(req, res) {
    try {
      const userId = req.userId;

      const contentListId = req.params.id;

      if (isNaN(contentListId)) {
        return res
          .status(400)
          .json({ erro: 'Id da lista de conteúdo, valor inválido' });
      }

      const {
        page = 1,
        page_size: pageSize = 30,
        type,
        sort_by: sortBy = 'title.asc',
      } = req.query;

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
      if (
        typeof type !== 'undefined' &&
        type !== 'movie' &&
        type !== 'show' &&
        type !== 'game'
      ) {
        errors.push('Parâmetro type, valor inválido');
      }
      if (sortBy) {
        if (typeof sortBy !== 'string') {
          errors.push('O parâmetro sort_by deve ser uma string');
        } else if (!getContentOrderByQuery(sortBy)) {
          errors.push('Parâmetro sort_by, valor inválido');
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const contentList = await getContentList(contentListId);

      if (!contentList) {
        return res
          .status(400)
          .json({ erro: 'Lista de conteúdo não encontrada' });
      }

      if (
        (contentList.sharing_option === 'private' &&
          contentList.user_id !== userId) ||
        (contentList.sharing_option === 'followed_profiles' &&
          !(await isUserFollowing(contentList.user_id, userId)))
      ) {
        return res.sendStatus(403);
      }

      const { content, count } = await getContent({
        contentListId,
        pageSize,
        page,
        type,
        sortBy: getContentOrderByQuery(sortBy),
      });

      const totalPages = Math.ceil(count / pageSize);
      return res.json({
        page: parseInt(page),
        page_size: parseInt(pageSize),
        total_pages: totalPages === 0 ? 1 : totalPages,
        total_results: count,
        results: content,
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
