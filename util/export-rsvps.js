var levelup = require('levelup')
var config = require('rc')('wedding', require('../default-config'))

var db = levelup(process.env.DB_PATH || config.dbPath)

db.createReadStream().pipe(process.stdout)
