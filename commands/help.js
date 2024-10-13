const config = require("../config/config")

function help(player, args, room) {
    let { command } = args

    const Commands = require('.')

    if (command) {
        Commands.forEach(command => {
            if (command.name !== args.command) return
            room.sendAnnouncement(
                `Comando: ${command.name}\n` +
                (command.args.length > 0 ? // Verifica si hay argumentos
                    `Argumentos: ${command.args.map(arg => `<${arg}>`).join(' ')}\n` : '') +
                `Descripcion: ${command.description}\n`,
                player.id,
                config.colors.GRAY,
                'small-bold'
            )
        })
    } else {
        let texto = 'Los comandos disponibles son: \n\n'

        Commands.forEach(command => {
            if (command.options.admin && !player.admin) return
            texto+=
            `Comando: ${command.name}\n` +
            (command.args.length > 0 ? // Verifica si hay argumentos
                `Argumentos: ${command.args.map(arg => `<${arg}>`).join(' ')}\n` : '') +
            `Descripcion: ${command.description}\n\n`
        })

        texto+='Podes usar !help <comando> para saber información sobre un comando en específico'

        room.sendAnnouncement(
            texto,
            player.id,
            config.colors.GRAY,
            'small-bold'
        )
    }
}

module.exports = help
