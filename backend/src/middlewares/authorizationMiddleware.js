const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: 'no "access_token" provided' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2)
    return res.status(401).json({ message: '"access_token" error' });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ message: '"access_token" malformed' });

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'invalid "access_token"' });

    req.profileId = decoded.sub;

    return next();
  });
};
