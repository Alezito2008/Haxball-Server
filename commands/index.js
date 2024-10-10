const Command = require('../lib/commands')

const help = require("./help")
const giveAdmin = require("./admin")
const ping = require("./ping")
const setTime = require('./time')

const Commands = [
    new Command('help', ['command'], 'Muestra esta pagina', true, help),
    new Command('admin', ['code'], 'Le da admin a un jugador', false, giveAdmin),
    new Command('ping', [], 'Hace un ping a un jugador', false, ping),
    new Command('time', ['minutes'], 'Establece un tiempo límite', false, setTime)
]

module.exports = Commands
