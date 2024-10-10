require('dotenv').config()

module.exports = {
    prefix: '!',
    room: {
        roomName: "Server Test",
        maxPlayers: 2,
        public: true,
        noPlayer: true,
        token: process.env.TOKEN
    },
    stadium: "Small",
    scoreLimit: 5,
    timeLimit: 0,
    isStopped: true,
    secret: Math.floor(Math.random() * 10000).toString(),
    colors: {
        RED: 0xF25F55,
        BLUE: 0x0000FF,
        YELLOW: 0xFFFF00,
        GREEN: 0x00FF00,
        ORANGE: 0xFFA500,
        PURPLE: 0x800080,
        PINK: 0xFFC0CB,
        BLACK: 0x000000,
        WHITE: 0xFFFFFF,
        PRIMARY: 0x1E90FF,
        GRAY: 0xBBBBBB
    }
}