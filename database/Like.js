module.exports = function (sequelize, DataTypes) {
  return sequelize.define('like', {
    type: {
      type: DataTypes.STRING(40),
      unique: true
    }
  })
}
