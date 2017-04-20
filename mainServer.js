const path = require('path')
const express = require('express')
const Serializer = require('sequelize-to-json')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const app = express()
const session = require('express-session')
const PgSimpleStore = require('connect-pg-simple')(session)  // PostgreSQL session store
const dbConfig = require('./database/config')
const sessionStore = new PgSimpleStore({
  conString: 'pg://' + dbConfig.username + ':' + dbConfig.password + '@localhost/' + dbConfig.database
})
const passportSocketIo = require('passport.socketio')
const cookieParser = require('cookie-parser')

const config = require('./config')
const db = require('./database')

// ----------------------------- GLOBAL FUNCITONS -------------------------------
const relativePathToAbsolute = __dirname
  ? (relativePath) => path.normalize(path.join(__dirname, relativePath))
  : (relativePath) => relativePath
// ---------------------------- PASSPORT CONFIG --------------------------------
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

passport.use(new FacebookStrategy({
  clientID: config.facebook.id,
  clientSecret: config.facebook.secret,
  callbackURL: config.facebook.callbackUrl,
  profileFields: ['id', 'displayName', 'photos', 'email', 'location']
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      // Check whether the User exists or not using profile.id
      db.User.findOrCreate({where: {identification: profile.id}, defaults: {name: profile.displayName, profilePicture: profile.photos[0].value, email: profile.email, location: profile.location}})
      .spread(function (user, created) {
        if (!created) {
          user.updateAttributes({name: profile.displayName, profilePicture: profile.photos[0].value, email: profile.email, location: profile.location})
        }
      })
      // Further DB code.
      return done(null, profile)
    })
  }
))

// ---------------------------- COOKIES CONFIG ---------------------------------
app.use(cookieParser())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(session({
  key: 'express.sid',
  secret: config.session.secret,
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}))
if (config.authenticate) {
  app.use(passport.initialize())
  app.use(passport.session())
}

// --------------------------- EXPRESS ROUTING ---------------------------------
// public paths from config
for (let key in config.publicPaths) {
  app.use('/' + key, express.static(relativePathToAbsolute(config.publicPaths[key])))
}

function ensureAuthenticated (req, res, next) {
  if (!config.authenticate) return next()
  if (req.isAuthenticated()) return next()
  res.redirect('/public/login.html')
}

app.set('view engine', 'ejs')

app.get('/artists.json', ensureAuthenticated, function (req, res) {
  db.Artist.findAll().then(artists => {
    var serializedArtists = Serializer.serializeMany(artists, db.Artist, {exclude: ['createdAt', 'updatedAt']})
    serializedArtists.forEach(artist => {
      let sliceIndex = artist.picturePath.indexOf('pictures')
      artist.picturePath = artist.picturePath.slice(sliceIndex)
    })
    res.json(serializedArtists)
  })
})

var artistFilter = new Serializer(db.Artist, {
  exclude: ['createdAt', 'updatedAt']
})
app.get('/artist/:id.json', ensureAuthenticated, function (req, res) {
  db.Artist.findOne({where: {id: req.params.id}})
    .then(artist => {
      var serializedArtist = artistFilter.serialize(artist)
      let sliceIndex = serializedArtist.picturePath.indexOf('pictures')
      serializedArtist.picturePath = serializedArtist.picturePath.slice(sliceIndex)
      res.json(serializedArtist)
    })
    .catch(() => {
      res.status(404)
      res.send({ error: 'Not found' })
    })
})

app.get('/artist/:id/songs.json', ensureAuthenticated, function (req, res) {
  db.Album.findAll({where: {artistId: req.params.id}})
    .then(albums => {
      var albumIds = []
      albums.forEach(album => {
        albumIds.push(album.dataValues.id)
      })
      db.Song.findAll({ where: {
        albumId: albumIds
      }})
        .then(songs => {
          var serializedSongs = Serializer.serializeMany(songs, db.Song, {exclude: ['createdAt', 'updatedAt']})
          res.json(serializedSongs)
        }).catch(() => {
          res.status(404)
          res.send({ error: 'No songs found' })
        })
    })
    .catch(() => {
      res.status(404)
      res.send({ error: 'No albums found' })
    })
})

app.get('/albums.json', ensureAuthenticated, function (req, res) {
  db.Album.findAll().then(albums => {
    var serializedAlbums = Serializer.serializeMany(albums, db.Album, {exclude: ['createdAt', 'updatedAt']})
    serializedAlbums.forEach(album => {
      let sliceIndex = album.picturePath.indexOf('pictures')
      album.picturePath = album.picturePath.slice(sliceIndex)
    })
    res.json(serializedAlbums)
  })
})

app.get('/artist/:artistId/albums.json', ensureAuthenticated, function (req, res) {
  db.Album.findAll({where: {artistId: req.params.artistId}}).then(albums => {
    var serializedAlbums = Serializer.serializeMany(albums, db.Album, {exclude: ['createdAt', 'updatedAt']})
    serializedAlbums.forEach(album => {
      let sliceIndex = album.picturePath.indexOf('pictures')
      album.picturePath = album.picturePath.slice(sliceIndex)
    })
    res.json(serializedAlbums)
  })
})

var albumFilter = new Serializer(db.Album, {
  exclude: ['createdAt', 'updatedAt']
})
app.get('/album/:id.json', ensureAuthenticated, function (req, res) {
  db.Album.findOne({where: {id: req.params.id}})
    .then(album => {
      var serializedAlbum = albumFilter.serialize(album)
      let sliceIndex = serializedAlbum.picturePath.indexOf('pictures')
      serializedAlbum.picturePath = serializedAlbum.picturePath.slice(sliceIndex)
      res.json(serializedAlbum)
    })
    .catch(() => {
      res.status(404)
      res.send({ error: 'Not found' })
    })
})

app.get('/album/:id/songs.json', ensureAuthenticated, function (req, res) {
  db.Song.findAll({where: {albumId: req.params.id}}).then(songs => {
    var serializedSongs = Serializer.serializeMany(songs, db.Song, {exclude: ['createdAt', 'updatedAt']})
    res.json(serializedSongs)
  })
})

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['user_location'] }),
  function (req, res) {}
)

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => { res.redirect('/') }
)

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

app.get('*', ensureAuthenticated, function (req, res) {
  if (req.user === undefined || !config.authenticate) {
    res.render('pages/index', {user: {name: 'Test', picture: undefined}})
  } else {
    res.render('pages/index', {
      user: {
        name: req.user.displayName,
        picture: req.user.photos.length > 0 ? req.user.photos[0].value : undefined
      }
    })
  }
})

//  ------------------------------------SOCKET IO-------------------------------
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// ---------SOKCET AUTH USING COOKEIS --------------
function onAuthorizeSuccess (data, accept) {
  accept()
}
function onAuthorizeFail (data, message, error, accept) {
  if (error) {
    accept(new Error(message))
  }
}

if (config.authenticate) {
  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,       // the same middleware you registrer in express
    key: 'express.sid',       // the name of the cookie where express/connect stores its session_id
    secret: config.session.secret,    // the session_secret to parse the cookie
    store: sessionStore,        // we NEED to use a sessionstore. no memorystore please
    success: onAuthorizeSuccess,  // *optional* callback on success - read more below
    fail: onAuthorizeFail     // *optional* callback on fail/error - read more below
  }))
}

// -------------------SOCKET "ROUTING"----------------

io.on('connection', function (socket) {

})

//  ---------------------------------START SERVER-------------------------------
server.listen(config.port)
