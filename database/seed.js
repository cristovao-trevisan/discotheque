var db = require('./index')

db.Artist.create({
  name: 'Cristóvão Trevisan',
  picturePath: '../pictures/Cristóvão Trevisan.png',
  description: 'I, Myself and I'
})

db.Artist.create({
  name: 'Leo Fressato',
  description: 'Soooo romantic!!'
})

db.Artist.create({
  name: 'Luciano Faccini y Melina Mulazani',
  picturePath: '../pictures/Luciano Faccini y Melina Mulazani.png',
  description: 'O mais novo do novo mundo!!'
})
