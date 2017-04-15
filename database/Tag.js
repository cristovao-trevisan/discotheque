module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tag', {
    name: {
      type: DataTypes.STRING(40),
      unique: true
    }
  })
}
