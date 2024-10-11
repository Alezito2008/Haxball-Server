const config = require("../config/config");
const data = require("../data/players");

function setSize(player, args, room) {
    let { radius } = args

    if (!config.sizeEnabled) {
        return room.sendAnnouncement('No te podes cambiar el tamaño en este momento', player.id, config.colors.RED, 'bold')
    }

    if (isNaN(radius) || radius < 1) {
        return room.sendAnnouncement('El tamaño debe ser un número y mayor a 0', player.id, config.colors.RED, 'bold')
    }

    data.players[player.id].radius = radius
    room.setPlayerDiscProperties(player.id, { radius })
    room.sendAnnouncement(`Cambiaste tu tamaño a ${radius}`, player.id, config.colors.BLUE, 'bold')
}

module.exports = setSize;
