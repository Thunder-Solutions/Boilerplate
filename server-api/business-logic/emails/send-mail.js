import nodemailer from 'nodemailer';

const {
  MAILER_EMAIL,
  MAILER_CLIENT_ID,
  MAILER_PRIVATE_KEY,
} = process.env;

const DEFAULT_MESSAGE = {
  to: 'jon.dewitt@thunder.solutions, vinnie.volpe@thunder.solutions',
  subject: 'Message from Thunder Solutions LLC',
  text: 'This message was sent by our servers at https://thunder.solutions.',
  html: /* html */`
    <p>
      This message was sent by our servers at
      <a href="https://thunder.solutions">https://thunder.solutions</a>.
    </p>
  `,
};

export const sendEmail = async (_message = {}) => {
  const message = {
    ...DEFAULT_MESSAGE,
    ..._message,
    text: _message.text || (_message.html || '').replace(/(<([^>]+)>)/gi, '') || DEFAULT_MESSAGE.text,
    html: _message.html || _message.text || DEFAULT_MESSAGE.html,
    from: `Thunder Solutions LLC <${MAILER_EMAIL}>`,
  };
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: MAILER_EMAIL,
      serviceClient: MAILER_CLIENT_ID,
      privateKey: MAILER_PRIVATE_KEY,
    },
  });
  try {
    await transporter.verify();
    return await transporter.sendMail(message);
  } catch (err) {
    return err;
  }
};
