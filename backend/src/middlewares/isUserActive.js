const knex = require('../database');

module.exports = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.sendStatus(401);
    }

    const user = await knex('users').select().where({ id: userId }).first();

    if (!user) {
      return res.status(400).json({ erro: 'Usuário não encontrado' });
    }

    if (!user.is_active) {
      return res.status(403).json({ erro: 'Usuário não confirmou seu e-mail' });
    }

    next();
  } catch (error) {
    return res.sendStatus(500);
  }
};
