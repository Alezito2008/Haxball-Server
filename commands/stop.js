const config = require("../config/config");

function stop(player, args, room) {
    if (config.isStopped) {
        room.sendAnnouncement('El partido ya está detenido', player.id, config.colors.RED, 'bold');
        return;
    }

    room.stopGame();
}

module.exports = stop;
