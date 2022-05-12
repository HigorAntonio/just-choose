const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('../database');
const uaParser = require('ua-parser-js');

const Queue = require('../lib/Queue');
const redisClient = require('../lib/redisClient');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION_TIME = process.env.ACCESS_TOKEN_EXPIRATION_TIME;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const CONFIRM_EMAIL_TOKEN_SECRET = process.env.CONFIRM_EMAIL_TOKEN_SECRET;
const FORGOT_PASSWORD_TOKEN_SECRET = process.env.FORGOT_PASSWORD_TOKEN_SECRET;

const saddAsync = redisClient.sadd;
const sremAsync = redisClient.srem;
const sismemberAsync = redisClient.sismember;
const smembersAsync = redisClient.smembers;

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const generateAccessToken = (params) => {
  return jwt.sign(params, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

const sendEmailConfimation = async (userId, email) => {
  try {
    const emailConfirmationToken = jwt.sign(
      { id: userId },
      CONFIRM_EMAIL_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    await Queue.add('ConfirmationMail', { email, emailConfirmationToken });
  } catch (error) {
    throw error;
  }
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

      const user = await knex('users')
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
        const [userId] = await trx('users').insert(
          { name, email, method: 'local' },
          'id'
        );
        const encryptedPassword = encryptPassword(password);

        newUser.user_id = userId;
        newUser.password = encryptedPassword;

        await trx('local_users').insert(newUser);

        await sendEmailConfimation(newUser.user_id, email);
      });

      const accessToken = generateAccessToken({ id: newUser.user_id });
      const ua = uaParser(req.headers['user-agent']);
      // TODO: Obter informações de localização do usuário através do ip (estado, país) e armazená-las no token
      const refreshToken = jwt.sign(
        { id: newUser.user_id, os: ua.os.name, browser: ua.browser.name },
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

      const user = await knex
        .select('u.id', 'u.name', 'u.email', 'lu.password')
        .from('users as u')
        .where({ email })
        .innerJoin('local_users as lu', 'u.id', 'lu.user_id')
        .first();

      if (!user)
        return res.status(400).json({ erro: 'Usuário não encontrado' });

      if (!bcrypt.compareSync(password, user.password))
        return res.status(400).json({ erro: 'Senha inválida' });

      const accessToken = generateAccessToken({ id: user.id });
      const ua = uaParser(req.headers['user-agent']);
      // TODO: Obter informações de localização do usuário através do ip (estado, país) e armazená-las no token
      const refreshToken = jwt.sign(
        { id: user.id, os: ua.os.name, browser: ua.browser.name },
        REFRESH_TOKEN_SECRET
      );
      await saddAsync(`refreshTokensUser${user.id}`, refreshToken);

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

      try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
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
        return res.status(401).json({ erro: 'RefreshToken inválido' });
      }
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

      try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
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
      } catch (error) {
        return res.status(403).json({ erro: 'RefreshToken inválido' });
      }
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

      const user = await knex
        .select('u.id', 'u.name', 'u.email', 'lu.password')
        .from('users as u')
        .where({ email })
        .innerJoin('local_users as lu', 'u.id', 'lu.user_id')
        .first();
      if (!user) {
        return res.status(400).json({ erro: 'Usuário não encontrado ' });
      }

      const token = jwt.sign({ id: user.id }, FORGOT_PASSWORD_TOKEN_SECRET, {
        expiresIn: '15m',
      });
      await saddAsync('forgotPasswordTokens', token);

      await Queue.add('ForgotPasswordMail', { email, token });

      return res.sendStatus(200);
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

      const user = await knex
        .select('u.id', 'u.name', 'u.email', 'lu.password')
        .from('users as u')
        .where({ email })
        .innerJoin('local_users as lu', 'u.id', 'lu.user_id')
        .first();
      if (!user) {
        return res.status(400).json({ erro: 'Usuário não encontrado ' });
      }

      if ((await sismemberAsync('forgotPasswordTokens', token)) !== 1) {
        return res.status(403).json({ erro: 'Token inválido' });
      }

      try {
        const decoded = jwt.verify(token, FORGOT_PASSWORD_TOKEN_SECRET);

        if (decoded.id !== user.id) {
          return res.status(403).json({ error: 'E-mail inválido' });
        }
        const encryptedPassword = encryptPassword(password);

        await sremAsync('forgotPasswordTokens', token);

        await knex('local_users')
          .update({ password: encryptedPassword })
          .where({ user_id: user.id });

        return res.sendStatus(200);
      } catch (error) {
        return res.status(403).json({ erro: 'Token inválido' });
      }
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async userDevices(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(403).json({ erro: 'Usuário inválido' });
      }

      const devicesTokens = await smembersAsync(`refreshTokensUser${userId}`);
      const decodedTokens = devicesTokens.map((token) => {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        return { ...decoded, token };
      });

      return res.json(decodedTokens);
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async exitDevice(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(403).json({ erro: 'Usuário inválido' });
      }

      const { password, refreshToken } = req.body;
      const errors = [];
      if (!password) {
        errors.push('Senha não informada');
      } else if (typeof password !== 'string') {
        errors.push('Senha, valor inválido');
      }
      if (!refreshToken) {
        errors.push('RefreshToken não informado');
      } else if (typeof refreshToken !== 'string') {
        errors.push('RefreshToken, valor inválido');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const user = await knex
        .select('u.id', 'u.name', 'u.email', 'lu.password')
        .from('users as u')
        .where({ ['u.id']: userId })
        .innerJoin('local_users as lu', 'u.id', 'lu.user_id')
        .first();
      if (!user) {
        return res.status(403).json({ erro: 'Usuário não encontrado' });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ erro: 'Senha inválida' });
      }

      if (
        (await sremAsync(`refreshTokensUser${user.id}`, refreshToken)) === 0
      ) {
        return res.status(400).json({ erro: 'RefreshToken não encontrado' });
      }
      // TODO: Enviar um email ao usuário, informando que a "sessão" em um dos seus dispositivos foi encerrada

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async confirmEmail(req, res) {
    try {
      const token = req.params.token;
      if (!token) {
        return res.status(400).json({ erro: 'Token não informado' });
      }
      if (typeof token !== 'string') {
        return res.status(400).json({ erro: 'Token, valor inválido' });
      }

      const decoded = jwt.verify(token, CONFIRM_EMAIL_TOKEN_SECRET);

      const user = await knex
        .select('u.id', 'u.name', 'u.email', 'lu.password')
        .from('users as u')
        .where({ ['u.id']: decoded.id })
        .innerJoin('local_users as lu', 'u.id', 'lu.user_id')
        .first();
      if (!user) {
        return res.status(400).json({ erro: 'Usuário não encontrado' });
      }

      await knex('users').update({ is_active: true }).where({ id: decoded.id });

      return res.sendStatus(200);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({ erro: 'Token inválido' });
      }
      return res.sendStatus(500);
    }
  },

  async resendConfirmEmail(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(403).json({ erro: 'Usuário inválido' });
      }

      const user = await knex
        .select('u.id', 'u.name', 'u.email', 'lu.password')
        .from('users as u')
        .where({ ['u.id']: userId })
        .innerJoin('local_users as lu', 'u.id', 'lu.user_id')
        .first();
      if (!user) {
        return res.status(403).json({ erro: 'Usuário não encontrado' });
      }

      await sendEmailConfimation(userId, user.email);

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },

  async updatePassword(req, res) {
    try {
      const userId = req.userId;

      const { currentPassword, newPassword } = req.body;
      const errors = [];

      if (!currentPassword) {
        errors.push('Senha atual não informada');
      } else if (typeof currentPassword !== 'string') {
        errors.push('Senha atual, valor inválido');
      }
      if (!newPassword) {
        errors.push('Nova senha não informada');
      } else if (typeof newPassword !== 'string') {
        errors.push('Nova senha, valor inválido');
      } else if (newPassword.length < 8) {
        errors.push('A nova senha deve ter no mínimo 8 caracteres');
      }
      if (errors.length > 0) {
        return res.status(400).json({ erros: errors });
      }

      const user = await knex
        .select('u.id', 'u.name', 'u.email', 'lu.password')
        .from('users as u')
        .where('u.id', userId)
        .innerJoin('local_users as lu', 'u.id', 'lu.user_id')
        .first();

      if (!user)
        return res.status(400).json({ erro: 'Usuário não encontrado' });

      if (!bcrypt.compareSync(currentPassword, user.password))
        return res.status(400).json({ erro: 'Senha inválida' });

      const encryptedPassword = encryptPassword(newPassword);

      await knex('local_users')
        .update({ password: encryptedPassword })
        .where({ user_id: userId });

      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(500);
    }
  },
};
