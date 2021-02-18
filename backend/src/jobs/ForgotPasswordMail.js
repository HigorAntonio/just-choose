const Mail = require('../lib/Mail');

module.exports = {
  key: 'ForgotPasswordMail',
  async handle({ data }) {
    const { email, token } = data;

    await Mail.sendMail({
      to: email,
      from: 'justchoose@juschoose.com.br',
      template: 'auth/forgot_password',
      context: { token },
    });
  },
};
