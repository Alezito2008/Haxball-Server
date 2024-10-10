const config = require("../config/config")

class Command {
    constructor(name, args, description, action, options) {
        this.name = name,
        this.args = args || []
        this.description = description
        this.options = {
            admin: false,
            optionalArgs: false,
            ...options
        }
        this.action = function (player, message, room) {
            const messageArgs = message.split(' ')
            messageArgs.shift()

            if (this.options.admin && !player.admin) {
                room.sendAnnouncement('No tienes permisos para usar este comando', player.id, config.colors.RED, 'bold')
                return
            }

            if (!this.options.optionalArgs && messageArgs.length !== this.args.length) {
                room.sendAnnouncement(
                    `Debes usar el comando de la siguiente manera:\n${config.prefix}${this.name} ${this.args.map(arg => `<${arg}>`).join(' ')}`,
                    player.id,
                    config.colors.YELLOW,
                    'bold'
                )
                return
            }

            const args = {}

            this.args.forEach((nombreArg, index) => {
                args[nombreArg] = messageArgs[index]
            })

            action(player, args, room)
        }
    }
}

module.exports = Command
