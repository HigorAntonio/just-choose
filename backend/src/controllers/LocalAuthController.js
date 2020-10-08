const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('../database');
const { promisify } = require('util');
const redisClient = require('../redisClient');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const saddAsync = promisify(redisClient.sadd).bind(redisClient);
const sremAsync = promisify(redisClient.srem).bind(redisClient);
const sismemberAsync = promisify(redisClient.sismember).bind(redisClient);

const encryptPassword = password => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const generateAccessToken = params => {
  return jwt.sign(params, ACCESS_TOKEN_SECRET, { expiresIn: 20 });
}

module.exports = {
  async create(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name) 
        return res.status(400).json({ erro: 'Nome não informado' });
      
      if (!email)
        return res.status(400).json({ erro: 'E-mail não informado' });

      if (!password)
        return res.status(400).json({ erro: 'Senha não informada' });

      if (password.length < 8)
        return res.status(400).json({ 
          erro: 'A senha deve ter no mínimo 8 caracteres' 
        });

      const user = await knex('local_users')
        .where({ name }).orWhere({ email }).first();
      if (user && user.name === name) {
        return res.status(400).json({ erro: 'Nome já cadastrado' });
      }
      if (user && user.email === email) {
        return res.status(400).json({ erro: 'E-mail já cadastrado'});
      }

      const newUser = {};
      await knex.transaction(async trx => {
        const [userId] = await trx('users').insert({ method: 'local' }, 'id');
        const encryptedPassword = encryptPassword(password);
        
        newUser.user_id = userId;
        newUser.name = name;
        newUser.email = email;
        newUser.password = encryptedPassword;
        
        await trx('local_users').insert(newUser);
      });

      const accessToken = generateAccessToken({ id: newUser.user_id });
      const refreshToken = jwt.sign({ id: newUser.user_id }, REFRESH_TOKEN_SECRET);
      await saddAsync('refreshTokens', refreshToken);
      
      res.json({ accessToken, refreshToken });
    } catch (err) {
      return res.status(500).json({ erro: err });
    }
  }
};