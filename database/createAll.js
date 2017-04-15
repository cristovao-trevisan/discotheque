const db = require('./index')

db.sequelize.sync({ force: true })
