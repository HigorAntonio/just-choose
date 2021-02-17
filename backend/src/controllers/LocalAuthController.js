const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('../database');
const { promisify } = require('util');
const redisClient = require('../redisClient');
const mailer = require('../modules/mailer');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const FORGOT_PASSWORD_TOKEN_SECRET = process.env.FORGOT_PASSWORD_TOKEN_SECRET;

const saddAsync = promisify(redisClient.sadd).bind(redisClient);
const sremAsync = promisify(redisClient.srem).bind(redisClient);
const sismemberAsync = promisify(redisClient.sismember).bind(redisClient);

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const generateAccessToken = (params) => {
  return jwt.sign(params, ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
};

module.exports = {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;
      const errors = [];

      if (!name) {
        errors.push('Nome não informado');
      } else if (typeof name !== 'string') {
        errors.push('Nome, valor inválido');
      }
      if (!email) {
        errors.push('E-mail não informado');
      } else if (typeof email !== 'string') {
        errors.push('E-mail, valor inválido');
      }
      if (!password) {
        errors.push('Senha não informada');
      } else if (typeof password !== 'string') {
        errors.push('Senha, valor inválido');
      } else if (password.length < 8) {
        errors.push('A senha deve ter no mínimo 8 caracteres');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const user = await knex('local_users')
        .where({ name })
        .orWhere({ email })
        .first();
      if (user && user.name === name) {
        return res.status(400).json({ erro: 'Nome já cadastrado' });
      }
      if (user && user.email === email) {
        return res.status(400).json({ erro: 'E-mail já cadastrado' });
      }

      const newUser = {};
      await knex.transaction(async (trx) => {
        const [userId] = await trx('users').insert({ method: 'local' }, 'id');
        const encryptedPassword = encryptPassword(password);

        newUser.user_id = userId;
        newUser.name = name;
        newUser.email = email;
        newUser.password = encryptedPassword;

        await trx('local_users').insert(newUser);
      });

      const accessToken = generateAccessToken({ id: newUser.user_id });
      const refreshToken = jwt.sign(
        { id: newUser.user_id },
        REFRESH_TOKEN_SECRET
      );
      await saddAsync(`refreshTokensUser${newUser.user_id}`, refreshToken);

      return res.json({ accessToken, refreshToken });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async signin(req, res) {
    try {
      const { email, password } = req.body;
      const errors = [];

      if (!email) {
        errors.push('E-mail não informado');
      } else if (typeof email !== 'string') {
        errors.push('E-mail, valor inválido');
      }
      if (!password) {
        errors.push('Senha não informada');
      } else if (typeof password !== 'string') {
        errors.push('Senha, valor inválido');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const user = await knex('local_users').where({ email }).first();

      if (!user)
        return res.status(400).json({ erro: 'Usuário não encontrado' });

      if (!bcrypt.compareSync(password, user.password))
        return res.status(400).json({ erro: 'Senha inválida' });

      const accessToken = generateAccessToken({ id: user.user_id });
      const refreshToken = jwt.sign({ id: user.user_id }, REFRESH_TOKEN_SECRET);
      await saddAsync(`refreshTokensUser${user.user_id}`, refreshToken);

      return res.json({ accessToken, refreshToken });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ erro: 'RefreshToken não informado' });
      } else if (typeof refreshToken !== 'string') {
        return res.status(400).json({ erro: 'RefreshToken, valor inválido' });
      }

      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ erro: 'RefreshToken inválido' });
        }
        (async () => {
          try {
            if (
              (await sismemberAsync(
                `refreshTokensUser${decoded.id}`,
                refreshToken
              )) !== 1
            ) {
              return res.status(401).json({ erro: 'RefreshToken inválido' });
            }

            delete decoded.iat;
            const accessToken = generateAccessToken(decoded);
            return res.json({ accessToken });
          } catch (error) {
            return res.sendStatus(500);
          }
        })();
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'RefreshToken não informado' });
      }
      if (typeof refreshToken !== 'string') {
        return res.status(400).json({ error: 'RefreshToken, valor inválido' });
      }

      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ erro: 'RefreshToken inválido' });
        }

        if (decoded.id !== req.userId) {
          return res.status(403).json({ erro: 'Usuário inválido' });
        }

        if (
          (await sremAsync(`refreshTokensUser${decoded.id}`, refreshToken)) ===
          0
        ) {
          return res.status(400).json({ erro: 'RefreshToken não encontrado' });
        }

        return res.sendStatus(204);
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ erro: 'E-mail não informado' });
      } else if (typeof email !== 'string') {
        return res.status(400).json({ erro: 'E-mail, valor inválido' });
      }

      const user = await knex('local_users').where({ email }).first();
      if (!user) {
        return res.status(400).json({ erro: 'Usuário não encontrado ' });
      }

      const token = jwt.sign({ id: user.id }, FORGOT_PASSWORD_TOKEN_SECRET, {
        expiresIn: '15m',
      });
      await saddAsync('forgotPasswordTokens', token);

      mailer.sendMail(
        {
          to: email,
          from: 'justchoose@juschoose.com.br',
          template: 'auth/forgotpassword',
          context: { token },
        },
        (error) => {
          if (error) {
            return res.status(400).json({
              erro: 'Não foi possível enviar o e-mail de recuperação de senha',
            });
          }

          return res.sendStatus(200);
        }
      );
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async resetPassword(req, res) {
    try {
      const { email, token, password } = req.body;
      const errors = [];

      if (!email) {
        errors.push('E-mail não informado');
      } else if (typeof email !== 'string') {
        errors.push('E-mail, valor inválido');
      }
      if (!token) {
        errors.push('Token não informado');
      } else if (typeof token !== 'string') {
        errors.push('Token, valor inválido');
      }
      if (!password) {
        errors.push('Senha não informada');
      } else if (typeof password !== 'string') {
        errors.push('Senha, valor inválido');
      } else if (password.length < 8) {
        errors.push('A senha deve ter no mínimo 8 caracteres');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const user = await knex('local_users').where({ email }).first();
      if (!user) {
        return res.status(400).json({ erro: 'Usuário não encontrado ' });
      }

      if ((await sismemberAsync('forgotPasswordTokens', token)) !== 1) {
        return res.status(403).json({ erro: 'Token inválido' });
      }

      jwt.verify(token, FORGOT_PASSWORD_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ erro: 'Token inválido' });
        }
        (async () => {
          try {
            if (decoded.id !== user.id) {
              return res.status(403).json({ error: 'E-mail inválido' });
            }
            const encryptedPassword = encryptPassword(password);

            await knex('local_users')
              .update({ password: encryptedPassword })
              .where({ id: user.id });

            await sremAsync('forgotPasswordTokens', token);

            return res.sendStatus(200);
          } catch (error) {
            return res.sendStatus(500);
          }
        })();
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
