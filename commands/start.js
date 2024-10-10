const config = require("../config/config");

function start(player, args, room) {
    if (!config.isStopped) {
        room.sendAnnouncement('El partido ya está en juego', player.id, config.colors.RED, 'bold');
        return;
    }

    room.startGame();
}

module.exports = start;
