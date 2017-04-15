module.exports = function (sequelize, DataTypes) {
  return sequelize.define('artist', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
    },
    picturePath: {
      type: DataTypes.STRING
    }
  })
}
