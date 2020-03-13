const qs = require('querystring');

const createStandupDialog = function (elementsArray, trigger_id, ts) {
  return {
    token: process.env.SLACK_ACCESS_TOKEN,
    trigger_id,
    dialog: JSON.stringify({
      title: 'Daily standup',
      callback_id: ts,
      submit_label: 'Submit',
      elements: [
        {
          label: 'Project',
          type: 'select',
          name: 'project',
          options: elementsArray,
        },
        {
          label: 'Last 24 Hours',
          type: 'textarea',
          name: 'last24',
          placeholder: 'input what you did last 24 hours',
        },
        {
          label: 'Next 24 Hours',
          type: 'textarea',
          name: 'next24',
          placeholder: 'input what you will do in the next 24 hours',
        },
        {
          label: 'Blockers',
          type: 'textarea',
          name: 'blockers',
          placeholder: 'Any blocker? please let us know.',
        },
      ],
    }),
  };
};

const createAuthModal = (redirect_url, trigger_id) => {
  // User token not found, ask user to authorize on slack so we can get token.
  const url = 'https://slack.com/oauth/authorize?';
  const q = qs.stringify({
    client_id: process.env.SLACK_CLIENT_ID, // - issued when you created your app (required)
    scope: 'bot channels:read channels:write chat:write:bot chat:write:user commands', // - permissions to request (see below) (required)
    redirect_uri: redirect_url, // - URL to redirect back to (see below) (optional)
    state: 'KHStandup', // - unique string to be passed back upon completion (optional)
    team: 'T2TNTDPMZ', // - Slack team ID of a workspace to attempt to restrict to (optional)
  });
  return {
    token: process.env.SLACK_ACCESS_TOKEN,
    trigger_id,
    view: JSON.stringify({
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Authorization',
      },
      close: {
        type: 'plain_text',
        text: 'Done',
      },
      callback_id: 'user-authorization',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `You have not authorised the app. <${url + q}|Click here to authorize the app>.`,
          },
        },
      ],
    }),
  };
};

module.exports = { createStandupDialog, createAuthModal };
