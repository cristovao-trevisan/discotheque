const Sequelize = require('sequelize')
const config = require('./config')
const path = require('path')
// initialize database connection
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config.options
)

// load models
const models = [
  'Album',
  'Artist',
  'ItemLike',
  'ItemTag',
  'Like',
  'Song',
  'Tag',
  'User'
]

models.forEach((model) => {
  module.exports[model] = sequelize.import(path.join(__dirname, model))
})

//---------------------------------RELATIONS-----------------
;(function (m) {
  //--------------------------TAGS------------
  // make artists taggable
  m.Artist.belongsToMany(m.Tag, {
    through: {
      model: m.ItemTag,
      unique: false,
      scope: {
        taggable: 'artist'
      }
    },
    foreignKey: 'taggableId',
    constraints: false
  })
  m.Tag.belongsToMany(m.Artist, {
    through: {
      model: m.ItemTag,
      unique: false
    },
    foreignKey: 'tagId',
  })

  // make albums taggable
  m.Album.belongsToMany(m.Tag, {
    through: {
      model: m.ItemTag,
      unique: false,
      scope: {
        taggable: 'album'
      }
    },
    foreignKey: 'taggableId',
    constraints: false
  })
  m.Tag.belongsToMany(m.Album, {
    through: {
      model: m.ItemTag,
      unique: false
    },
    foreignKey: 'tagId',
  })

  // make songs taggable
  m.Song.belongsToMany(m.Tag, {
    through: {
      model: m.ItemTag,
      unique: false,
      scope: {
        taggable: 'song'
      }
    },
    foreignKey: 'taggableId',
    constraints: false
  })
  m.Tag.belongsToMany(m.Song, {
    through: {
      model: m.ItemTag,
      unique: false
    },
    foreignKey: 'tagId',
  })

  //--------------------------LIKES-----------
  // make artists likable
  m.Artist.belongsToMany(m.Like, {
    through: {
      model: m.ItemLike,
      unique: false,
      scope: {
        likable: 'artist'
      }
    },
    foreignKey: 'likableId',
    constraints: false
  })
  m.Like.belongsToMany(m.Artist, {
    through: {
      model: m.ItemLike,
      unique: false
    },
    foreignKey: 'likeId',
  })

  // make albums likable
  m.Album.belongsToMany(m.Like, {
    through: {
      model: m.ItemLike,
      unique: false,
      scope: {
        likable: 'album'
      }
    },
    foreignKey: 'likableId',
    constraints: false
  })
  m.Like.belongsToMany(m.Album, {
    through: {
      model: m.ItemLike,
      unique: false
    },
    foreignKey: 'likeId',
  })

  // make songs likable
  m.Song.belongsToMany(m.Like, {
    through: {
      model: m.ItemLike,
      unique: false,
      scope: {
        likable: 'song'
      }
    },
    foreignKey: 'likableId',
    constraints: false
  })
  m.Like.belongsToMany(m.Song, {
    through: {
      model: m.ItemLike,
      unique: false
    },
    foreignKey: 'likeId',
  })


  //-------------------------BELONGS----------------------------
  // Artist is an user
  m.Artist.belongsTo(m.User)
  m.User.hasOne(m.Artist)
  // Albums belongs to artists
  m.Album.belongsTo(m.Artist)
  m.Artist.hasMany(m.Album)
  // Songs belongs to albuns
  m.Song.belongsTo(m.Album)
  m.Album.hasMany(m.Song)

})(module.exports)

// export connection
module.exports.sequelize = sequelize
