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
        },
        minsize: (val) => {
            if (isNaN(val) || val < 1) {
                return room.sendAnnouncement('El tamaño debe ser un número y mayor a 0', player.id, config.colors.RED, 'bold')
            }

            config.minSize = parseFloat(val);
            setSizes(players, room);
            room.sendAnnouncement(`Tamaño mínimo cambiado a ${val}`, player.id, config.colors.ORANGE, 'bold');
        },
        maxsize: (val) => {
            if (isNaN(val) || val < 1) {
                return room.sendAnnouncement('El tamaño debe ser un número y mayor a 0', player.id, config.colors.RED, 'bold')
            }

            config.maxSize = parseFloat(val);
            setSizes(players, room);
            room.sendAnnouncement(`Tamaño máximo cambiado a ${val}`, player.id, config.colors.ORANGE, 'bold');
        }
    }

    if (!configOptions[key]) {
        return room.sendAnnouncement('Configuración no encontrada!', player.id, config.colors.RED, 'bold')
    }

    configOptions[key](value)
}

module.exports = setConfig;
