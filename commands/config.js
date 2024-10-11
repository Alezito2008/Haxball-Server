const config = require("../config/config");
const { setSizes } = require("../utils/playerUtils");

function setConfig(player, args, room) {
    const { key, value } = args
    const players = room.getPlayerList()

    const configOptions = {
        size: (val) => {
            if (val === 'true') {
                config.sizeEnabled = true;
                setSizes(players, room);
                room.sendAnnouncement('Tamaños habilitados', player.id, config.colors.ORANGE, 'bold');
            } else if (val === 'false') {
                config.sizeEnabled = false;
                players.forEach(player => {
                    room.setPlayerDiscProperties(player.id, { radius: config.defaultSize });
                });
                room.sendAnnouncement('Tamaños deshabilitados', player.id, config.colors.ORANGE, 'bold');
            } else {
                room.sendAnnouncement('Valor inválido para sizeEnabled!', player.id, config.colors.RED, 'bold');
            }
        }
    }

    if (!configOptions[key]) {
        return room.sendAnnouncement('Configuración no encontrada!', player.id, config.colors.RED, 'bold')
    }

    configOptions[key](value)
}

module.exports = setConfig;
