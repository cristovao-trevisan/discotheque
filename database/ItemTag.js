module.exports = function (sequelize, DataTypes) {
  return sequelize.define('itemTag', {
    tagId: {
      type: DataTypes.INTEGER,
      unique: 'itemTagTaggable'
    },
    taggable: {
      type: DataTypes.STRING,
      unique: 'itemTagTaggable'
    },
    taggableId: {
      type: DataTypes.INTEGER,
      unique: 'itemTagTaggable',
      references: null
    }
  })
}
