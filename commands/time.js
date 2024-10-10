const config = require("../config/config")

function setTime(player, args, room) {
    let { minutes } = args
    if (!player.admin) {
        room.sendAnnouncement('No tienes permisos para usar este comando', player.id, config.colors.RED, 'bold')
        return
    }

    if (!config.isStopped) {
        room.sendAnnouncement('No podés cambiar el tiempo mientras el partido está en juego', player.id, config.colors.RED, 'bold')
        return
    }

    minutes = parseInt(minutes)
    if (isNaN(minutes) || minutes < 0 || minutes > 14) {
        room.sendAnnouncement('El tiempo debe ser un número desde 0 hasta 14', player.id, config.colors.RED, 'bold')
        return
    }

    room.setTimeLimit(minutes)
    room.sendAnnouncement(`Tiempo cambiado a ${minutes} minutos`, player.id, config.colors.GREEN, 'bold')
}

module.exports = setTime
