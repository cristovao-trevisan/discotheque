module.exports = function (sequelize, DataTypes) {
  return sequelize.define('itemLike', {
    likeId: {
      type: DataTypes.INTEGER,
      unique: 'itemLikeLikable'
    },
    likable: {
      type: DataTypes.STRING,
      unique: 'itemLikeLikable'
    },
    likableId: {
      type: DataTypes.INTEGER,
      unique: 'itemLikeLikable',
      references: null
    }
  })
}
