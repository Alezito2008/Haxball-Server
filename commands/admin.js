const config = require("../config/config")

function giveAdmin(player, args, room) {
    const { code } = args
    if (code === config.secret) {
        room.sendAnnouncement("Codigo correcto!", player.id, config.colors.WHITE, "bold")
        room.setPlayerAdmin(player.id, true)
    } else {
        room.sendAnnouncement("Código de admin incorrecto", player.id, config.colors.RED, "bold")
    }
}

module.exports = giveAdmin
