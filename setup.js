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

            // Commands.forEach((command) => {
            //     if (message.startsWith(config.prefix + command.name)) {
            //         command.action(player, message, room);
            //     }
            // });

            // if (Commands.map(command => config.prefix + command.name).includes(message)) {
            //     return false;
            // }

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

        room.onPlayerJoin = function(player) {
            console.log(player.name);
        }
    });
}

module.exports = setup
