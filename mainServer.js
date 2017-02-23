var fs = require('fs')
var Rx = require('rx')
var express = require('express')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var app = express()
var session = require('express-session')
var pgSimpleStore    = require('connect-pg-simple')(session)  // PostgreSQL session store
var pg = require('pg')
var dbConfig = require('./database/config')
var sessionStore = new pgSimpleStore({
  conString : 'pg://' + dbConfig.username + ':' + dbConfig.password + '@localhost/' + dbConfig.database
})
var passportSocketIo = require("passport.socketio")
var cookieParser = require('cookie-parser')

var config = require('./config')
var db = require('./database')

// --------- PASSPORT CONFIG -------------
passport.serializeUser(function(user, done) {
  done(null, user)
})
passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

passport.use(new FacebookStrategy({
    clientID: config.facebook.id,
    clientSecret:config.facebook.secret ,
    callbackURL: config.facebook.callbackUrl,
    profileFields: ['id', 'displayName', 'photos', 'email', 'location']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      db.User.findOrCreate({where: {facebookId: profile.id}, defaults: {name: profile.displayName, profilePicture: profile.photos[0].value, email: profile.email, location: profile.location}})
      .spread(function(user, created) {
        if(!created){
          user.updateAttributes({name: profile.displayName, profilePicture: profile.photos[0].value, email: profile.email, location: profile.location})
        }
      })
      //Further DB code.
      return done(null, profile)
    })
  }
))

app.use(cookieParser())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(session({
  key: 'express.sid',
  secret: config.session.secret,
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/public', ensureAuthenticated, express.static('views/public'))
app.use('/dist', ensureAuthenticated, express.static('dist'))

app.set('view engine', 'ejs')

app.get('/', ensureAuthenticated, function (req, res) {
  res.render('pages/index', {
      user: {
        name: req.user.displayName,
        picture: req.user.photos[0].value
      }
  })
})

app.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['user_location'] }),
  function(req, res){}
)

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {res.redirect('/')}
)

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/public/login.html')
}


//  ------------------------------------SOCKET IO-------------------------------

var server = require('http').createServer(app)
var io = require('socket.io')(server)

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express
  key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
  secret:       config.session.secret,    // the session_secret to parse the cookie
  store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
  success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
  fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
}))

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io')
  accept()
}

function onAuthorizeFail(data, message, error, accept){
  if(error){
    accept(new Error(message))
    console.log('failed connection to socket.io:', message)
  }
}

io.on('connection', function(socket){

  socket.on('artists', () => {
    if(socket.artistSubscription !== undefined){
      socket.artist$.dispose();
    }

    socket.artist$ = Rx.Observable.fromPromise(db.Artist.findAll())
      .flatMap(x => x)
      .flatMap(artist => Rx.Observable.just({
          id: artist.dataValues.id,
          name: artist.dataValues.name,
          description: artist.dataValues.description
        })
      )
      .subscribe(
        artist => socket.emit('artist', artist),
        err => {}
      )
  })

  socket.on('albums', (artistId) => {
    Rx.Observable.fromPromise(db.Album.findAll({where: {artistId}}))
      .flatMap(x => x)
      .flatMap(album => Rx.Observable.just({
        id: album.dataValues.id,
        title: album.dataValues.title,
        description: album.dataValues.description,
        artistId: album.dataValues.artistId
      }))
      .subscribe(
        album => socket.emit('album', album),
        err => {console.log(err)}
      )
  })

  socket.on('songs', (albumId) => {
    Rx.Observable.fromPromise(db.Song.findAll({where:{albumId}}))
      .flatMap(x => x)
      .flatMap(song => Rx.Observable.just({
        id: song.dataValues.id,
        title: song.dataValues.title,
        duration: song.dataValues.duration,
        infoHash: song.dataValues.infoHash,
        albumId: song.dataValues.albumId
      }))
      .subscribe(
        song => socket.emit('song', song),
        err => {}
      )
  })

  socket.on('song', (id) => {
    Rx.Observable.fromPromise(db.Song.findOne({where:{id: id}}))
      .flatMap(song => Rx.Observable.just({
        id: song.dataValues.id,
        title: song.dataValues.title,
        duration: song.dataValues.duration,
        infoHash: song.dataValues.infoHash,
        albumId: song.dataValues.albumId
      }))
      .subscribe(
        song => socket.emit('song', song),
        err => {}
      )
  })
})


server.listen(3000)
