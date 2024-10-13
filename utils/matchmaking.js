const config = require("../config/config")
const { shuffleArray } = require("./arrayUtils")

function selectPlayers(players) {
    if (players.length <= config.teamSize) return players

    const playersArray = Object.values(players)
    const sortedPlayers = playersArray.sort((a, b) => b.lastPlayed - a.lastPlayed) // ordena los jugadores de mayor a menor lastPlayed

    const maxLastPlayed = sortedPlayers[0].lastPlayed
    const sameLastPlayed = sortedPlayers.filter(p => p.lastPlayed === maxLastPlayed)

    if (sameLastPlayed.length > config.teamSize) {
        const shuffledArray = shuffleArray(sameLastPlayed)
        const seleccionados = shuffledArray.slice(0, config.teamSize)
        return seleccionados
    }

    return sortedPlayers.slice(0, config.teamSize)
}

module.exports = { selectPlayers }
