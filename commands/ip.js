const config = require("../config/config");
const data = require('../data/players');
const { hex2ascii } = require("../utils/converter");

function getIp(player, args, room) {
    let { id } = args
    id = parseInt(id.replace('#', ''))

    const playerData = data.players[id]

    if (!playerData) {
        room.sendAnnouncement(`No se encontró el jugador con el id ${id}`, player.id, config.colors.RED, 'bold');
        return;
    }

    const ip = hex2ascii(playerData.conn)

    room.sendAnnouncement(`La ip de ${playerData.name} es ${ip}`, player.id, config.colors.YELLOW, 'bold');
}

module.exports = getIp;
