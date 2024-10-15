const config = require('../config/config');
const data = require('../data/players');
const { balanceTeams } = require('../utils/matchmaking');
const { isAfk } = require('../utils/playerUtils');

function toggleAfk(player, args, room) {
    data.players[player.id].afk = !isAfk(player);
    if (isAfk(player)) {
        room.setPlayerTeam(player.id, 0);
        room.sendAnnouncement(`Ahora estás en modo afk`, player.id, config.colors.YELLOW, 'bold');
    } else {
        room.sendAnnouncement(`Ya no estás en modo afk`, player.id, config.colors.YELLOW, 'bold');
    }

    // no preguntes por que mierda funciona esto, pero funciona :)
    setTimeout(() => {
        balanceTeams(room);
    }, 0);
}

module.exports = toggleAfk;
