const fs = require('fs')
const readFile = require('fs-readfile-promise');
const Rx = require('rxjs/Rx')
require('rxjs/add/operator/mergeMap')
const express = require('express')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const app = express()
const session = require('express-session')
const pgSimpleStore = require('connect-pg-simple')(session)  // PostgreSQL session store
const pg = require('pg')
const dbConfig = require('./database/config')
const sessionStore = new pgSimpleStore({
  conString : 'pg://' + dbConfig.username + ':' + dbConfig.password + '@localhost/' + dbConfig.database
})
const passportSocketIo = require("passport.socketio")
const cookieParser = require('cookie-parser')

const config = require('./config')
const db = require('./database')

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
if(config.authenticate){
  app.use(passport.initialize())
  app.use(passport.session())
}

app.use('/public', express.static('views/public'))
app.use('/dist', ensureAuthenticated, express.static('dist'))

app.set('view engine', 'ejs')

app.get('*', ensureAuthenticated, function (req, res) {
  if(req.user === undefined || !config.authenticate) {
    res.render('pages/index', {user: {name: 'Test', picture: undefined}})
  }
  else {
    res.render('pages/index', {
      user: {
        name: req.user.displayName,
        picture: req.user.photos.length > 0 ? req.user.photos[0].value : undefined
      }
    })
  }
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
  if(!config.authenticate) return next()
  if (req.isAuthenticated()) { return next() }
  res.redirect('/public/login.html')
}


//  ------------------------------------SOCKET IO-------------------------------

const server = require('http').createServer(app)
const io = require('socket.io')(server)

if(config.authenticate){
  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,       // the same middleware you registrer in express
    key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
    secret:       config.session.secret,    // the session_secret to parse the cookie
    store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
    success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
    fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
  }))
}

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
    if(socket.artist$ !== undefined){
      socket.artist$.unsubscribe();
      socket.artist$ = undefined
    }

    socket.artist$ = Rx.Observable.fromPromise(db.Artist.findAll())
      .mergeMap(x => x)
      .mergeMap(artist => Rx.Observable.of({
          id: artist.dataValues.id,
          name: artist.dataValues.name,
          description: artist.dataValues.description
      }))
      .subscribe(
        artist => socket.emit('artist', artist),
        err => {}
      )
  })

  socket.on('artist', artistId => {
    Rx.Observable.fromPromise(db.Album.findAll({where: {artistId}}))
      .mergeMap(x => x)
      .mergeMap(album => Rx.Observable.of({
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

  socket.on('albums', () => {
    if(socket.album$ !== undefined){
      socket.album$.unsubscribe();
      socket.album$ = undefined
    }

    socket.album$ = Rx.Observable.fromPromise(db.Album.findAll())
      .mergeMap(x => x)
      .mergeMap(album => Rx.Observable.of({
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

  socket.on('songs', albumId => {
    Rx.Observable.fromPromise(db.Song.findAll({where:{albumId}}))
      .mergeMap(x => x)
      .mergeMap(song => Rx.Observable.of({
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

  socket.on('song', id => {
    Rx.Observable.fromPromise(db.Song.findOne({where:{id: id}}))
      .mergeMap(song => Rx.Observable.of({
        id: song.dataValues.id,
        title: song.dataValues.title,
        duration: song.dataValues.duration,
        infoHash: song.dataValues.infoHash,
        albumId: song.dataValues.albumId
      }))
      .onErrorResumeNext()
      .subscribe(
        song => socket.emit('song', song),
        err => {}
      )
  })

  socket.on('artist-picture', id => {
    Rx.Observable.fromPromise(db.Artist.findOne({where:{id}}))
      .mergeMap(artist => Rx.Observable.fromPromise(readFile(artist.dataValues.picturePath)))
      .onErrorResumeNext()
      .subscribe(buffer => socket.emit('artist-picture', { id, picture: buffer.toString('base64') }))
  })

  socket.on('album-picture', id => {
    Rx.Observable.fromPromise(db.Album.findOne({where:{id: id}}))
      .mergeMap(album => Rx.Observable.fromPromise(readFile(album.dataValues.picturePath)))
      .onErrorResumeNext()
      .subscribe(buffer => socket.emit('album-picture', { id, picture: buffer.toString('base64') }))
  })
})


server.listen(3000)
