const config = require("../config/config")
const { shuffleArray, getRandom } = require("./arrayUtils")
const { isAfk, resetAFKTimer } = require("./playerUtils")
const data = require('../data/players')

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

function balanceTeams(room) {
    const players = room.getPlayerList()
    const redPlayers = players.filter(p => p.team === 1)
    const bluePlayers = players.filter(p => p.team === 2)
    const spectators = players.filter(p => p.team === 0 && !isAfk(p))

    if (redPlayers.length === bluePlayers.length && redPlayers.length >= config.teamSize) return

    let selectedPlayer, teamToMove;

    if (spectators.length === 0) {
        // si no hay espectadores, mover a los jugadores
        if (Math.abs(redPlayers.length - bluePlayers.length) < 2) return

        if (redPlayers.length > bluePlayers.length) {
            selectedPlayer = getRandom(redPlayers)
            teamToMove = 2
        } else if (bluePlayers.length > redPlayers.length) {
            selectedPlayer = getRandom(bluePlayers)
            teamToMove = 1
        }
    } else {
        // meter a uno de los espectadores
        selectedPlayer = getRandom(spectators)

        if (redPlayers.length > bluePlayers.length) {
            teamToMove = 2
        } else if (bluePlayers.length > redPlayers.length) {
            teamToMove = 1
        } else if (redPlayers.length === bluePlayers.length) {
            teamToMove = getRandom([1, 2])
        }
    }

    if (selectedPlayer) {
        room.setPlayerTeam(selectedPlayer.id, teamToMove)
    }
}

module.exports = { selectPlayers, balanceTeams }
