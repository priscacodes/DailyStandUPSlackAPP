const rp = require('request-promise');

const bullets = (value) => '\t-  ' + value.replace(/\r?\n/g, '\n\t-  ');

const sendStandupMessage = (standup, channel_id, message_ts, user_token) => {
  const last24Hours = bullets(standup.last24hour);
  const next24Hours = bullets(standup.next24hour);
  const blockers = bullets(standup.blockers);
  const apiUrl = 'https://slack.com/api/chat.postMessage';
  const options = {
    token: user_token,
    method: 'POST',
    uri: apiUrl,
    form: {
      channel: channel_id,
      text: `*Project*\n\t${standup.project}\n*Last 24 Hours.*\n${last24Hours}\n*Next 24 Hours.*\n${next24Hours}\n*Blockers.*\n${blockers}`,
      as_user: true,
      thread_ts: message_ts,
    },
    headers: {
      Authorization: `Bearer ${user_token}`,
    },
    json: true,
  };

  rp(options)
    .then((parsedBody) => {
      // POST succeeded...
      console.log('ok', parsedBody);
    })
    .catch((err) => {
      // POST failed...
      console.log(err);
    });
};

const sendStandupReminder = () => {
  const apiUrl = 'https://slack.com/api/chat.postMessage';
  const options = {
    method: 'POST',
    uri: apiUrl,
    form: {
      channel: 'CQTB0L0MS',
      text: 'Reminder: Kindly post your daily stand-up on this thread.',
      attachments: JSON.stringify([
        {
          text: 'Click to submit',
          callback_id: 'submit-ticket_action',
          color: '#3AA3E3',
          attachment_type: 'default',
          actions: [
            {
              name: 'Submit',
              text: 'click here',
              type: 'button',
              value: 'submit',
            },
          ],
        },
      ]),
    },
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${process.env.SLACK_ACCESS_TOKEN}`,
    },
    json: true,
  };

  rp(options)
    .then((parsedBody) => {
      // POST succeeded...
      console.log('ok');
    })
    .catch((err) => {
      // POST failed...
      console.log(err);
    });
};

module.exports = { sendStandupMessage, sendStandupReminder };
