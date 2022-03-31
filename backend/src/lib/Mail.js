const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const mailConfig = require('../config/mail');

const transport = nodemailer.createTransport(mailConfig);

transport.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs',
      layoutsDir: path.resolve('./src/resources/mail/'),
      partialsDir: path.resolve('./src/resources/partials/'),
      defaultLayout: undefined,
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  })
);

module.exports = transport;
