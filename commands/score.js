const config = require("../config/config")

function setScore(player, args, room) {
    let { goals } = args

    if (!config.isStopped) {
        room.sendAnnouncement('No podés cambiar la cantidad de goles mientras el partido está en juego', player.id, config.colors.RED, 'bold')
        return
    }

    goals = parseInt(goals)
    if (isNaN(goals) || goals < 0 || goals > 14) {
        room.sendAnnouncement('Los goles deben ser un número desde 0 hasta 14', player.id, config.colors.RED, 'bold')
        return
    }

    room.setScoreLimit(goals)
    room.sendAnnouncement(`Cantidad de goles cambiada a ${goals}`, player.id, config.colors.GREEN, 'bold')
}

module.exports = setScore;
