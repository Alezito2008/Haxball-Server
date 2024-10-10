const Command = require('../lib/commands')

const help = require("./help")
const giveAdmin = require("./admin")
const ping = require("./ping")
const setTime = require('./time')
const setTime = require('./time')

const Commands = [
    new Command('help', ['command'], 'Muestra esta pagina', help, { optionalArgs: true }),
    new Command('admin', ['code'], 'Le da admin a un jugador', giveAdmin),
    new Command('ping', [], 'Hace un ping a un jugador', ping),
    new Command('time', ['minutes'], 'Establece un tiempo límite', setTime)
]

module.exports = Commands
