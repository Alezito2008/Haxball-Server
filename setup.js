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
    });
}

module.exports = setup
