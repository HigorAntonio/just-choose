const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2) {
      const [scheme, token] = parts;
      if (/^Bearer$/i.test(scheme)) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
          if (!err) {
            req.userId = decoded.id;
          }
        });
      }
    }
  }

  next();
};
