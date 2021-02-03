const postmark = require('postmark');

const client = process.env.POSTMARK_SERVER_API_TOKEN
  ? new postmark.ServerClient(process.env.POSTMARK_SERVER_API_TOKEN)
  : null;

async function sendTransactionalEmail(from, to, subject, htmlBody, textBody) {
  return (
    client &&
    client.sendEmail({
      From: from,
      To: to,
      Subject: subject,
      HtmlBody: htmlBody,
      TextBody: textBody,
      MessageStream: 'outbound',
    })
  );
}

module.exports = {
  sendTransactionalEmail,
};
