var db = require('./index')

db.Artist.create({
  name: 'Cristóvão Trevisan',
  picturePath: '../pictures/Cristóvão Trevisan.png',
  description: 'I, Myself and I'
})

db.Artist.create({
  name: 'Leo Fressato',
  picturePath: '../pictures/Leo Fressato.png',
  description: 'Soooo romantic!!'
})
