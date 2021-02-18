const Mail = require('../lib/Mail');

module.exports = {
  key: 'ConfirmationMail',
  async handle({ data }) {
    const { email, emailConfirmationToken } = data;

    await Mail.sendMail({
      to: email,
      from: 'justchoose@juschoose.com.br',
      template: 'auth/confirm_email',
      context: { emailConfirmationToken },
    });
  },
};
