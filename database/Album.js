module.exports = function (sequelize, DataTypes) {
  return sequelize.define('album', {
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT,
    },
    picturePath: {
      type: DataTypes.STRING
    }
  })
}
