const config = require('../config/config');
const data = require('../data/players')

function playAnimation(player, frames, room) {
    if (frames && frames.length > 0) {
        let frameIndex = 0;

        setTimeout(() => {
            const animation = setInterval(() => {
                if (frameIndex === frames.length) {
                    room.setPlayerAvatar(player, null)
                    clearInterval(animation)
                }
                room.setPlayerAvatar(player, frames[frameIndex])
                frameIndex++
            }, 1000);
        }, 1000)
    }
}

function setSizes(players, room) {
    players.forEach(p => {
        const currentRadius = data.players[p.id].radius

        if (currentRadius > config.maxSize) {
            data.players[p.id].radius = config.maxSize
        } else if (currentRadius < config.minSize) {
            data.players[p.id].radius = config.minSize
        }

        room.setPlayerDiscProperties(p.id, { radius: data.players[p.id].radius });
    })
}

function formatName(player) {
    const team = player.team === 1 ? '🔴' : player.team === 2 ? '🔵' : '⚫'
    return `[${team}] ${player.name}`
}

module.exports = { playAnimation, setSizes, formatName };