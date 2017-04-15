module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    identification: {
      type: DataTypes.STRING,
      unique: true
    },
    profilePicture: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    location: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING(60)
    }
  }, {
    instanceMethods: {

    }
  })
}
