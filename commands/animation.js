const config = require("../config/config");
const data = require("../data/players")

function setAnimation(player, args, room) {
    let { frames } = args
    
    frames = frames.split('')
    
    if (frames.length > 6) {
        room.sendAnnouncement('El máximo de frames debe ser 6', player.id, config.colors.RED, 'bold')
        return
    }

    const playerData = data.players[player.id]
    playerData.animation = frames

    console.log(data.players)
}

module.exports = setAnimation;
