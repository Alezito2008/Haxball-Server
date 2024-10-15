const config = require("../config/config");
const { isAfk } = require("../utils/playerUtils");

function afkList(player, args, room) {
    let afkPlayers = room.getPlayerList().filter(p => isAfk(p))

    if (afkPlayers.length === 0) {
        room.sendAnnouncement("No hay jugadores AFK", player.id, config.colors.ORANGE, 'bold')
        return
    }

    afkPlayers = afkPlayers.sort((a, b) => a.id - b.id)

    const afkPlayersNames = afkPlayers.map(p => `${p.name} (id: ${p.id})`).join(', ')

    room.sendAnnouncement(
        `Los jugadores AFK son: ${afkPlayersNames}`,
        player.id, config.colors.ORANGE,
        'bold'
    )
}

module.exports = afkList;
