module.exports = function (sequelize, DataTypes) {
  return sequelize.define('song', {
    title: {
      type: DataTypes.STRING,
      validate:{
        notEmpty: true
      }
    },
    duration: {
      type: DataTypes.FLOAT
    },
    order: {
      type: DataTypes.INTEGER
    },
    magnetURI: {
      type: DataTypes.STRING,
      unique: true
    },
    infoHash: {
      type: DataTypes.STRING,
      unique: true
    }
  })
}
