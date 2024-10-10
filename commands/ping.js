const config = require("../config/config")

function ping(player, args, room) {
    room.sendAnnouncement(`🏓 Pong!`, player.id, config.colors.WHITE, 'bold')
}

module.exports = ping
