const config = require("../config/config");

function kickAll(player, args, room) {
    const players = room.getPlayerList()
    players.forEach(p => {
        if (p.id === player.id) return
        room.kickPlayer(p.id, 'Server kick', false)
        room.sendAnnouncement('Se han expulsado a todos los jugadores de la sala', player.id, config.colors.YELLOW, 'small-bold')
    });
}

module.exports = kickAll;
