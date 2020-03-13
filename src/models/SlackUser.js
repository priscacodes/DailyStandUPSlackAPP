export default (sequelize, DataTypes) => {
  const SlackUser = sequelize.define('SlackUser', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slackId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
    },
    bearerToken: {
      type: DataTypes.STRING,
    },
  }, {});
  // SlackUser.associate = (models) => {
    // SlackUser.hasMany(models.Standup);
  // };
  return SlackUser;
};
