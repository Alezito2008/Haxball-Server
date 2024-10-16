const HaxballJS = require('haxball.js');
const config = require('./config/config');
const Commands = require('./commands');
const data = require('./data/players');
const fs = require('fs');
const path = require('path');
const shuffle = require('./commands/shuffle');
const { playAnimation, setSizes, formatName, isAfk, resetAFKTimer } = require('./utils/playerUtils');
const { selectPlayers, balanceTeams } = require('./utils/matchmaking');
const { hex2ascii } = require('./utils/converter');
const { checkAFKPlayers } = require('./services/afkService');

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
                const chatColor = data.players[player.id].afk ? config.colors.GRAY : config.colors.WHITE; // si esta afk gris, sino blanco
                room.sendAnnouncement(`${formatName(player)} » ${message}`, null, chatColor, 'bold'); // mandar mensaje normal formateado
            } else {
                // const command = Commands.find(command => message.startsWith(config.prefix + command.name)); // encontrar comando
                const command = Commands.find(command => 
                    new RegExp(`${config.prefix}${command.name}(\\s|$)`).test(message)
                ); // encontrar comando

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

            if (redCount < config.teamSize || blueCount < config.teamSize) {
                room.setPlayerTeam(player.id, redCount > blueCount ? 2 : 1);
            }

            data.players[player.id] = {
                ...player,
                lastActivity: Date.now(),
                afk: false,
                radius: config.defaultSize,
                animation: ['⚽', 'G', 'O', 'L', '⚽'],
                lastPlayed: 0,
            }

            console.log(`Se unió ${player.name} con ip ${hex2ascii(player.conn)}`);
        }

        room.onPlayerLeave = function (player) {
            balanceTeams(room)

            delete data.players[player.id]
        }

        room.onGameStart = function (player) {
            config.isStopped = false;

            const players = room.getPlayerList()

            players.forEach(p => {
                resetAFKTimer(p)
            })

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
            resetAFKTimer(player)

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

            if (lastPlayer && data.players[lastPlayer] && data.players[lastPlayer].name) {
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
                const spectators = room.getPlayerList().filter(p => p.team === 0 && !isAfk(p));
                const spectatorsData = spectators.map(s => data.players[s.id]);
                const newPlayers = selectPlayers(spectatorsData)

                newPlayers.forEach(p => {
                    room.setPlayerTeam(p.id, winnerTeam === 'blue' ? 1 : 2); // cambiar espectadores al equipo perdedor
                })

                if (room.getPlayerList().filter(p => p.team === 0 && !isAfk(p)).length === 0) { // si ya no quedan espectadores
                    shuffle(null, null, room);
                }

                room.sendAnnouncement('Iniciando siguiente juego en 5 segundos...', null, config.colors.WHITE, 'small-bold');

                setTimeout(() => {
                    room.getPlayerList().forEach(p => {
                        if (p.team === 0) return
                        data.players[p.id].lastPlayed = 0;
                    })
                    room.startGame();
                }, 5000);
            }, 1000)
        }

        room.onPlayerActivity = function (player) {
            resetAFKTimer(player)
        }

        setInterval(() => {
            if (config.isStopped) return;
            checkAFKPlayers(room);
        }, config.AFKCheckInterval * 1000);
    });
}

module.exports = setup
