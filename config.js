const path = require('path')

module.exports = {
  facebook  : {
    id      : 1648752715419279,
    secret  : '53436673fc769b1a4ea69b873b595fdf',
    callbackUrl: '/auth/facebook/callback'
  },
  session   : {
    secret : 'i think no one will found out this'
  },
  authenticate: false,
  port: 3000,
  // Format => route : path
  publicPaths: {
    pictures: '../pictures',
    public: 'views/public',
    dist: 'dist'
  }
}
