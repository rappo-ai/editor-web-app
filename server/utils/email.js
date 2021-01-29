const postmark = require('postmark');

const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_API_TOKEN);

async function sendTransactionalEmail(from, to, subject, htmlBody, textBody) {
  return client.sendEmail({
    From: from,
    To: to,
    Subject: subject,
    HtmlBody: htmlBody,
    TextBody: textBody,
    MessageStream: 'outbound',
  });
}

module.exports = {
  sendTransactionalEmail,
};
