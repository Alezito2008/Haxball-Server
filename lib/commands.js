const config = require("../config/config")

class Command {
    constructor(name, args, description, optionalArgs, action) {
        this.name = name,
        this.args = args || []
        this.description = description
        this.optionalArgs = optionalArgs || false
        this.action = function (player, message, room) {
            const messageArgs = message.split(' ')
            messageArgs.shift()

            if (!this.optionalArgs && messageArgs.length !== this.args.length) {
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
