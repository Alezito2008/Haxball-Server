const config = require('./config/config')
const setup = require('./setup')

console.log('Código de admin: ' + config.secret)
setup()
