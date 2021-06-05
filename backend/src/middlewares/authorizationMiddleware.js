const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ erro: 'AccessToken não fornecido' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2)
    return res.status(401).json({ erro: 'Erro no AccessToken' });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ erro: 'AccessToken no formato incorreto' });

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ erro: 'AccessToken inválido' });

    req.userId = decoded.id;

    return next();
  });
};
