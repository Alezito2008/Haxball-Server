const { shuffleArray } = require('../utils/arrayUtils')

function shuffle(player, args, room) {
    const players = room.getPlayerList()
    const shuffledPlayers = shuffleArray(players)

    shuffledPlayers.forEach((p, index) => {
        room.setPlayerTeam(p.id, (index % 2) + 1)
    })
}

module.exports = shuffle;
