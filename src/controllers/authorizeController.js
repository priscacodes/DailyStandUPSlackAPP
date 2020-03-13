const rp = require('request-promise');
const models = require('../models');

const { SlackUser } = models;

const AuthorizeController = {

  async authorizeApp(req, res) {
    const options = {
      uri: 'https://slack.com/api/oauth.access',
      method: 'POST',
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      body: `client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${req.query.code}`,
    };
    try {
      const authResponse = JSON.parse(await rp(options));
      if (authResponse.ok !== true) {
        throw new Error(`Operation failed with an error: ${authResponse.error}`);
      }

      // Save access token in database.
      const {
        access_token, team_id, team_name, user_id,
      } = authResponse;
      const user = await SlackUser.update(
        { bearerToken: access_token },
        { where: { slackId: user_id } },
      );
      console.log('slack user', user);
      if (!access_token) return res.status(500).send({ status: 'Error', data: 'Could not get user token.' });
      // @todo What should be returned?
      return res.status(200).send('App KHStandup has been authorized.');
    } catch (e) {
      console.log(e);
      return res.status(500).send({ status: 'Error', data: e });
    }
  },
};

export default AuthorizeController;
