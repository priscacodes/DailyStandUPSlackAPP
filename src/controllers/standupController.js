import Sequelize, {
  Op,
} from 'sequelize';

const axios = require('axios');
const qs = require('querystring');
const { Standup, Project, SlackUser } = require('../models');
const { sendStandupMessage } = require('../utils/message');
const { createStandupDialog, createAuthModal } = require('../utils/dialog');
const { findAuthorizedUser } = require('../utils/authorize');

const StandupController = {
  // Handle interactive actions from slack workspaces.
  async standupInteractive(req, res) {
    try {
      const body = JSON.parse(req.body.payload);
      let user = await findAuthorizedUser(body.user, body.token);

      // No user yet. So create user.
      if (user === null) {
        // Create slack user and ask to authorize the app.
        user = await SlackUser.create({
          name: body.user.name,
          slackId: body.user.id,
          token: body.token,
          bearerToken: '',
        });
      }
      // No user bearerToken, so redirect to authorization
      if (user.bearerToken === '') {
        const dialog = createAuthModal(`https://${req.hostname}${req.baseUrl}/authorize`, body.trigger_id);
        // Open the dialog by calling views.open method and sending the payload.
        axios.default.post('https://slack.com/api/views.open', qs.stringify(dialog))
          .then((result) => {
            return res.send('');
          })
          .catch((err) => {
            console.log('views.open call failed: %o', err);
            return res.sendStatus(500);
          });
        return res.send('');
      }

      // This submission is from the reminder button. So send standup dialog.
      if (body.callback_id === 'submit-ticket_action') {
        const projects = await Project.findAll();
        const elementsArray = projects.map(x => ({ label: x.name, value: x.name }));
        const apiUrl = 'https://slack.com/api';
        const { trigger_id, message_ts } = body;
        // create the dialog payload - includes the dialog structure, Slack API token,
        // and trigger ID
        const dialog = createStandupDialog(elementsArray, trigger_id, message_ts);

        // Open the dialog by calling dialog.open method and sending the payload.
        axios.default.post(`${apiUrl}/dialog.open`, qs.stringify(dialog))
          .then((result) => {
            return res.send('');
          }).catch((err) => {
            console.log('dialog.open call failed: %o', err);
            return res.sendStatus(500);
          });
      }
      // Submission from standup dialog.
      else if (body.type === 'dialog_submission') {
        const standup = await Standup.create({
          name: body.user.name.split('.').join(' '),
          project: body.submission.project,
          last24hour: body.submission.last24,
          next24hour: body.submission.next24,
          blockers: body.submission.blockers,
          team_id: body.team.id,
          team_domain: body.team.domain,
          slackId: body.user.id,
        });
        sendStandupMessage(standup, body.channel.id, body.callback_id, user.bearerToken);
        return res.status(200).send('');
      }
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  },

  // this allows companies or workspaces to fetch their daily standups
  async listStandUp(req, res) {
    try {
      const standups = await Standup.findAll();
      return res.status(200).send({ status: 'Success', data: standups });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ status: 'Error', data: 'an error occured please try again!!!' });
    }
  },

  // this send standups for a particular day
  async listDailyStandUp(req, res) {
    try {
      const { date } = req.query;
      const standups = await Standup.findAll({
        where: {
          [Op.or]: [
            {
              createdAt: {
                [Op.ne]: `${date}`,
              },
            },
          ],
        },
      });
      return res.status(200).send({ status: 'Success', data: standups });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send({ status: 'Error', data: 'an error occured please try again!!!' });
    }
  },
};

export default StandupController;
