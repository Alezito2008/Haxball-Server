const HaxballJS = require('haxball.js');
const config = require('./config/config');
const Commands = require('./commands');
const data = require('./data/players');
const fs = require('fs');
const path = require('path');
const shuffle = require('./commands/shuffle');
const { getRandom } = require('./utils/arrayUtils');
const { playAnimation, setSizes, formatName } = require('./utils/playerUtils');
const { selectPlayers } = require('./utils/matchmaking');

const setup = () => {
    HaxballJS.then((HBInit) => {
        const room = HBInit(
            {...config.room}
        )

        room.setDefaultStadium(config.stadium);
        room.setScoreLimit(config.scoreLimit);
        room.setTimeLimit(config.timeLimit);
        room.setTeamsLock(config.teamsLock);
        room.setCustomStadium(fs.readFileSync(
            path.join(__dirname, 'maps/power.hbs'),
            'utf-8')
        );

        room.onPlayerChat = function (player, message) {
            if (!message.startsWith(config.prefix)) {
                room.sendAnnouncement(`${formatName(player)} » ${message}`, null, config.colors.WHITE, 'bold'); // mandar mensaje normal formateado
            } else {
                const command = Commands.find(command => message.startsWith(config.prefix + command.name)); // encontrar comando

                if (command) {
                    command.action(player, message, room);
                } else {
                    room.sendAnnouncement('El comando no existe. Usa !help para ver la lista de comandos',
                        player.id, config.colors.YELLOW,
                        'bold'
                    );    
                }
            }

            return false;
        }

        room.onRoomLink = function (link) {
            console.log(link);
        };

        room.onPlayerJoin = function (player) {
            const redCount = room.getPlayerList().filter(p => p.team === 1).length;
            const blueCount = room.getPlayerList().filter(p => p.team === 2).length;

            if (redCount !== config.teamSize || blueCount !== config.teamSize) {
                room.setPlayerTeam(player.id, redCount > blueCount ? 2 : 1);
            }

            data.players[player.id] = {
                ...player,
                radius: config.defaultSize,
                animation: ['⚽', 'G', 'O', 'L', '⚽'],
                lastPlayed: 0,
            }

            console.log(player.name);
        }

        room.onPlayerLeave = function (player) {
            const redPlayers = room.getPlayerList().filter(p => p.team === 1)
            const bluePlayers = room.getPlayerList().filter(p => p.team === 2)
            const spectators = room.getPlayerList().filter(p => p.team === 0)

            // if (redPlayers.length - bluePlayers.length >= 2) {
            //     const randomPlayer = getRandom(redPlayers)
            //     room.setPlayerTeam(randomPlayer.id, 2);
            // } else if (bluePlayers.length - redPlayers.length >= 2) {
            //     const randomPlayer = getRandom(bluePlayers)
            //     room.setPlayerTeam(randomPlayer.id, 1);
            // }

            if (spectators.length === 0) return
            
            if (redPlayers.length > bluePlayers.length) {
                const randomPlayer = getRandom(spectators)
                room.setPlayerTeam(randomPlayer.id, 2);
            } else if (bluePlayers.length > redPlayers.length) {
                const randomPlayer = getRandom(spectators)
                room.setPlayerTeam(randomPlayer.id, 1);
            }

            delete data.players[player.id]
        }

        room.onGameStart = function (player) {
            config.isStopped = false;

            const players = room.getPlayerList()

            if (config.sizeEnabled) {
                setSizes(players, room);
            }
        }

        room.onGameStop = function (player) {
            config.isStopped = true;
        }

        room.onPositionsReset = function () {
            const players = room.getPlayerList()

            if (config.sizeEnabled) {
                setSizes(players, room);
            }
        }

        room.onPlayerTeamChange = function (player) {
            if (config.sizeEnabled) {
                setSizes([player], room);
            }
        }

        room.onPlayerBallKick = function (player) {
            config.lastPlayerKick[player.team] = player.id;
        }

        room.onTeamGoal = function (team) {
            const color = config.teamColor[team]
            const lastPlayer = config.lastPlayerKick[team]

            const emoji = team === 1 ? '🔴' : '🔵'

            if (lastPlayer && data.players[lastPlayer].name) {
                room.sendAnnouncement(
                    `Gol de ${data.players[lastPlayer].name} para el equipo ${emoji}${color.toUpperCase()}${emoji}!`,
                    null,
                    config.colors[color.toUpperCase()],
                    'bold'
                )

                const frames = data.players[lastPlayer].animation
                playAnimation(lastPlayer, frames, room);
            }
        }

        room.onTeamVictory = function (scores) {
            const players = room.getPlayerList()
            const winnerTeam = scores.red > scores.blue ? 'red' : 'blue';

            players.forEach(p => {
                data.players[p.id].lastPlayed++;
            });

            const playersToChange = players.filter(p => p.team === (winnerTeam === 'red' ? 2 : 1));

            playersToChange.forEach(p => {
                room.setPlayerTeam(p.id, 0); // Cambiar a espectadores
            });

            setTimeout(() => {
                room.sendAnnouncement(`El equipo ${winnerTeam} ha ganado!`, null, config.colors[winnerTeam.toUpperCase()], 'bold');
                const spectators = room.getPlayerList().filter(p => p.team === 0);
                const spectatorsData = spectators.map(s => data.players[s.id]);
                const newPlayers = selectPlayers(spectatorsData)

                newPlayers.forEach(p => {
                    room.setPlayerTeam(p.id, winnerTeam === 'blue' ? 1 : 2); // cambiar al equipo perdedor
                })

                if (room.getPlayerList().filter(p => p.team === 0).length === 0) { // si ya no quedan espectadores
                    shuffle(null, null, room);
                }

                room.sendAnnouncement('Iniciando siguiente juego en 5 segundos...', null, config.colors.WHITE, 'small-bold');

                setTimeout(() => {
                    // set lastplayed to 0 to all teams
                    room.getPlayerList().forEach(p => {
                        if (p.team === 0) return
                        data.players[p.id].lastPlayed = 0;
                    })
                    room.startGame();
                }, 5000);
            }, 1000)
        }
    });
}

module.exports = setup
