const Sequelize = require('sequelize')

const config = require('./config')

var sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
})

//---------------------------DEFINES-------------------
// define user
var User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  },
  facebookId: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  profilePicture: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  }
})

//define artist
var Artist = sequelize.define('artist', {
  description: {
    type: Sequelize.STRING(4000),
  },
  alias: {
    type: Sequelize.STRING,
    unique: true
  }
})

// define album
var Album = sequelize.define('album', {
  title: {
    type: Sequelize.STRING,
    validate:{
      notEmpty: true
    }
  },
  picturePath: {
    type: Sequelize.STRING
  }
})

// define song
var Song = sequelize.define('song', {
  title: {
    type: Sequelize.STRING,
    validate:{
      notEmpty: true
    }
  },
  duration: {
    type: Sequelize.INTEGER
  },
  magnetURI: {
    type: Sequelize.STRING,
    unique: true
  },
  infoHash: {
    type: Sequelize.STRING,
    unique: true
  }
})

// define tag

var Tag = sequelize.define('tag', {
  name: {
    type: Sequelize.STRING(40),
    unique: true
  }
})

ItemTag = sequelize.define('itemTag', {
  tagId: {
    type: Sequelize.INTEGER,
    unique: 'itemTagTaggable'
  },
  taggable: {
    type: Sequelize.STRING,
    unique: 'itemTagTaggable'
  },
  taggableId: {
    type: Sequelize.INTEGER,
    unique: 'itemTagTaggable',
    references: null
  }
})

// define like

var Like = sequelize.define('like', {
  type: {
    type: Sequelize.STRING(40),
    unique: true
  }
})

ItemLike = sequelize.define('itemLike', {
  likeId: {
    type: Sequelize.INTEGER,
    unique: 'itemLikeLikable'
  },
  likable: {
    type: Sequelize.STRING,
    unique: 'itemLikeLikable'
  },
  likableId: {
    type: Sequelize.INTEGER,
    unique: 'itemLikeLikable',
    references: null
  }
})

//---------------------------------RELATIONS-----------------

//--------------------------TAGS------------
// make artists taggable
Artist.belongsToMany(Tag, {
  through: {
    model: ItemTag,
    unique: false,
    scope: {
      taggable: 'artist'
    }
  },
  foreignKey: 'taggableId',
  constraints: false
})
Tag.belongsToMany(Artist, {
  through: {
    model: ItemTag,
    unique: false
  },
  foreignKey: 'tagId',
})

// make albums taggable
Album.belongsToMany(Tag, {
  through: {
    model: ItemTag,
    unique: false,
    scope: {
      taggable: 'album'
    }
  },
  foreignKey: 'taggableId',
  constraints: false
})
Tag.belongsToMany(Album, {
  through: {
    model: ItemTag,
    unique: false
  },
  foreignKey: 'tagId',
})

// make songs taggable
Song.belongsToMany(Tag, {
  through: {
    model: ItemTag,
    unique: false,
    scope: {
      taggable: 'song'
    }
  },
  foreignKey: 'taggableId',
  constraints: false
})
Tag.belongsToMany(Song, {
  through: {
    model: ItemTag,
    unique: false
  },
  foreignKey: 'tagId',
})

//--------------------------LIKES-----------
// make artists likable
Artist.belongsToMany(Like, {
  through: {
    model: ItemLike,
    unique: false,
    scope: {
      likable: 'artist'
    }
  },
  foreignKey: 'likableId',
  constraints: false
})
Like.belongsToMany(Artist, {
  through: {
    model: ItemLike,
    unique: false
  },
  foreignKey: 'likeId',
})

// make albums likable
Album.belongsToMany(Like, {
  through: {
    model: ItemLike,
    unique: false,
    scope: {
      likable: 'album'
    }
  },
  foreignKey: 'likableId',
  constraints: false
})
Like.belongsToMany(Album, {
  through: {
    model: ItemLike,
    unique: false
  },
  foreignKey: 'likeId',
})

// make songs likable
Song.belongsToMany(Like, {
  through: {
    model: ItemLike,
    unique: false,
    scope: {
      likable: 'song'
    }
  },
  foreignKey: 'likableId',
  constraints: false
})
Like.belongsToMany(Song, {
  through: {
    model: ItemLike,
    unique: false
  },
  foreignKey: 'likeId',
})


//-------------------------BELONGS----------------------------
// Artist is an user
Artist.belongsTo(User)
User.hasOne(Artist)
// Albums belongs to artists
Album.belongsTo(Artist)
Artist.hasMany(Album)
// Songs belongs to albuns
Song.belongsTo(Album)
Album.hasMany(Song)


//---------------------Sync------------------------------------
sequelize.sync().then(() => {

})

//----------------------Useful functions-----------------------


function existsUniqueArtist(name, callback) {
  // try to find an alias
  Artist.find({
    where: {
      alias: name
    }
  }).then((art) => {
    if(art) {
      callback(true, art)
    }
    else {
      // could not find alias -> try to find user name
      Artist.findAndCountAll({
        include: [{
          model: User,
          where: {
            name: name
          }
        }]
      }).then((result) => {
        if(result.count == 1 ) {
          Artist.find({
            where: {
              alias: result.rows[0].get('name')
            }
          }).then((art) => {
            if(art){
              callback(false)
            }
            else {
              callback(true, result.rows[0])
            }
          })
        }
        else {
          callback(false)
        }
      })
    }
  })
}


//-------------------------Exports-----------------------------
module.exports = {
  User: User,
  Artist: Artist,
  Album: Album,
  Song: Song,
  Tag:  Tag,
  Like: Like,
  sequelize:  sequelize,
  Sequelize:  Sequelize,
  existsUniqueArtist: existsUniqueArtist
}
