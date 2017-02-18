var fs = require('fs')
var express = require('express')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var app = express()

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
      db.User.findOrCreate({where: {facebookId: profile.id}, defaults: {name: profile.displayName, profilePicture: profile.photos[0].value, email: profile.email}})
      .spread(function(user, created) {
        if(!created){
          user.updateAttributes({name: profile.displayName, profilePicture: profile.photos[0].value, email: profile.email})
        }
      })
      //Further DB code.
      return done(null, profile)
    })
  }
))

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({
  secret: 'i think no one will found out this',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())


app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  if(req.isAuthenticated()){
    res.render('pages/index', {
        user: {
          name: req.user.displayName,
          picture: req.user.photos[0].value
        }
    })
  }
  else{
    writeFile('./views/public/login.html', 'text/html', res)
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


app.get('/index.js', ensureAuthenticated, function (req, res) {
  writeFile('./dist/index.js', 'application/javascript', res)
})

app.get('/common.js', ensureAuthenticated, function (req, res) {
  writeFile('./dist/common.js', 'application/javascript', res)
})

app.get('/index.css', ensureAuthenticated, function (req, res) {
  writeFile('./dist/index.css', 'text/css', res)
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}

function writeFile(file, contentType, res){
  fs.readFile(file, function (err, html) {
    if (err) {
        throw err
    }
    res.writeHeader(200, {'Content-Type': contentType})
    res.write(html)
    res.end()
  })
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
