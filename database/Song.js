module.exports = function (sequelize, DataTypes) {
  return sequelize.define('song', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    duration: {
      type: DataTypes.FLOAT
    },
    order: {
      type: DataTypes.INTEGER
    },
    torrent: {
      type: DataTypes.STRING(1024),
      unique: true
    }
  })
}
