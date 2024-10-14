const toggleAfk = require('../commands/afk')
const config = require('../config/config')
const data = require('../data/players')

function checkAFKPlayers(room) {
    const players = room.getPlayerList().filter(p => p.team !== 0)

    players.forEach(p => {
        const passedTime = Date.now() - data.players[p.id].lastActivity
        if (passedTime >= config.AFKTime * 1000) {
            toggleAfk(p, null, room)
        }
    })
}

module.exports = { checkAFKPlayers }
