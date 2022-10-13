const knex = require('../database');

module.exports = async (req, res, next) => {
  try {
    const profileId = req.profileId;

    const profile = await knex('profiles')
      .select()
      .where({ id: profileId })
      .first();

    if (!profile) {
      return res.status(400).json({ erro: 'Usuário não encontrado' });
    }

    if (!profile.is_active) {
      return res.status(403).json({ erro: 'Usuário não confirmou seu e-mail' });
    }

    next();
  } catch (error) {
    return res.sendStatus(500);
  }
};
