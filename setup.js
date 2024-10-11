const HaxballJS = require('haxball.js');
const config = require('./config/config');
const Commands = require('./commands');

const setup = () => {
    HaxballJS.then((HBInit) => {
        const room = HBInit(
            {...config.room}
        )

        room.setDefaultStadium(config.stadium);
        room.setScoreLimit(config.scoreLimit);
        room.setTimeLimit(config.timeLimit);
        room.setTeamsLock(config.teamsLock);

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
            console.log(player.name);
        }

        room.onGameStart = function (player) {
            config.isStopped = false;
        }

        room.onGameStop = function (player) {
            config.isStopped = true;
        }

        room.onPlayerBallKick = function (player) {
            config.lastPlayerKick[player.team] = player.name.trim();
        }

        room.onTeamGoal = function (team) {
            const color = config.teamColor[team]
            const lastPlayer = config.lastPlayerKick[team]

            const emoji = team === 1 ? '🔴' : '🔵'

            if (lastPlayer) {
                room.sendAnnouncement(
                    `Gol de ${lastPlayer} para el equipo ${emoji}${color.toUpperCase()}${emoji}!`,
                    null,
                    config.colors[color.toUpperCase()],
                    'bold'
                )
            }
        }
    });
}

module.exports = setup
