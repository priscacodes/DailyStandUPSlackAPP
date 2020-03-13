export default (sequelize, DataTypes) => {
  const Standup = sequelize.define('Standup', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last24hour: DataTypes.STRING,
    next24hour: DataTypes.STRING,
    blockers: DataTypes.STRING,
    team_id: DataTypes.STRING,
    team_domain: DataTypes.STRING,
    slackId: DataTypes.STRING,
  }, {});
  Standup.associate = (models) => {
    // Standup.belongsTo(models.SlackUser, {
    //   onDelete: 'CASCADE',
    //   foreignKey: {
    //     allowNull: false
    //   },
    // });
  };
  return Standup;
};
