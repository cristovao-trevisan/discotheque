var db = require('./index')

db.Artist.create({
  name: 'Cristóvão Trevisan',
  description: 'I, Myself and I'
})

db.Artist.create({
  name: 'Leo Fressato',
  description: 'Soooo romantic!!'
})
