const knex = require('../database');

module.exports = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.sendStatus(401);
    }

    const { method } = await knex('users')
      .select('method')
      .where({ id: userId })
      .first();

    if (method !== 'local') {
      next();
    }

    const { is_active } = await knex(`${method}_users`)
      .select('is_active')
      .where({ user_id: userId })
      .first();

    if (!is_active) {
      return res.status(403).json({ erro: 'Usuário não confirmou seu e-mail' });
    }

    next();
  } catch (error) {
    return res.sendStatus(500);
  }
};