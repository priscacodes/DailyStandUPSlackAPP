module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Standups', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    project: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last24hour: {
      type: Sequelize.STRING,
    },
    next24hour: {
      type: Sequelize.STRING,
    },
    blockers: {
      type: Sequelize.STRING,
    },
    team_id: {
      type: Sequelize.STRING,
    },
    team_domain: {
      type: Sequelize.STRING,
    },
    slackId: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  // eslint-disable-next-line arrow-parens
  down: queryInterface => queryInterface.dropTable('Standups'),
};
