const { SlackUser } = require('../models');

const findAuthorizedUser = async (user, token) => SlackUser.findOne({
  where: {
    name: user.name,
    slackId: user.id,
    token,
  },
});

module.exports = { findAuthorizedUser };
