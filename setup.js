const HaxballJS = require('haxball.js');
const config = require('./config/config');
const Commands = require('./commands');
const data = require('./data/players');
const fs = require('fs');
const path = require('path');
const shuffle = require('./commands/shuffle');
const { getRandom } = require('./utils/arrayUtils');
const { playAnimation } = require('./utils/playerUtils');

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
            if (!message.startsWith(config.prefix)) return

            const command = Commands.find(command => message.startsWith(config.prefix + command.name));

            if (command) {
                command.action(player, message, room);
            } else {
                room.sendAnnouncement('El comando no existe. Usa !help para ver la lista de comandos',
                    player.id, config.colors.YELLOW,
                    'bold'
                );    
            }

            return false;
        }

        room.onRoomLink = function (link) {
            console.log(link);
        };

        room.onPlayerJoin = function (player) {
            const redCount = room.getPlayerList().filter(p => p.team === 1).length;
            const blueCount = room.getPlayerList().filter(p => p.team === 2).length;

            room.setPlayerTeam(player.id, redCount > blueCount ? 2 : 1);

            data.players[player.id] = {
                ...player,
                animation: ['⚽', 'G', 'O', 'L', '⚽']
            }

            console.log(player.name);
        }

        room.onPlayerLeave = function (player) {
            const redPlayers = room.getPlayerList().filter(p => p.team === 1)
            const bluePlayers = room.getPlayerList().filter(p => p.team === 2)

            if (redPlayers.length - bluePlayers.length >= 2) {
                const randomPlayer = getRandom(redPlayers)
                room.setPlayerTeam(randomPlayer.id, 2);
            } else if (bluePlayers.length - redPlayers.length >= 2) {
                const randomPlayer = getRandom(bluePlayers)
                room.setPlayerTeam(randomPlayer.id, 1);
            }

            delete data.players[player.id]
        }

        room.onGameStart = function (player) {
            config.isStopped = false;
        }

        room.onGameStop = function (player) {
            config.isStopped = true;

            if (player === null) {
                room.sendAnnouncement('Iniciando siguiente juego en 3 segundos...', null, config.colors.WHITE, 'small-bold');
                setTimeout(() => {
                    shuffle(null, null, room);
                    room.startGame();
                }, 3000);
            }
        }

        room.onPlayerBallKick = function (player) {
            config.lastPlayerKick[player.team] = player.id;
        }

        room.onTeamGoal = function (team) {
            const color = config.teamColor[team]
            const lastPlayer = config.lastPlayerKick[team]

            const emoji = team === 1 ? '🔴' : '🔵'

            if (lastPlayer) {
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
    });
}

module.exports = setup
