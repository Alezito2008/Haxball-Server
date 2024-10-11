const Command = require('../lib/commands')

const help = require("./help")
const giveAdmin = require("./admin")
const ping = require("./ping")
const setTime = require('./time')
const stop = require('./stop')
const start = require('./start')
const setScore = require('./score')
const kickAll = require('./kickall')
const setAnimation = require('./animation')

const Commands = [
    new Command('help', ['command'], 'Muestra esta pagina', help, { optionalArgs: true }),
    new Command('admin', ['code'], 'Le da admin a un jugador', giveAdmin),
    new Command('ping', [], 'Hace un ping a un jugador', ping),
    new Command('time', ['minutes'], 'Establece un tiempo límite', setTime, { admin: true }),
    new Command('score', ['goals'], 'Establece el puntaje', setScore, { admin: true }),
    new Command('stop', [], 'Detiene el juego', stop, { admin: true }),
    new Command('start', [], 'Inicia el juego', start, { admin: true }),
    new Command('kickall', [], 'Expulsa a todos los jugadores', kickAll, { admin: true }),
    new Command('animation', ['frames'], 'Establece una animación al hacer gol (ej: !animation GOAL)', setAnimation),
]

module.exports = Commands
