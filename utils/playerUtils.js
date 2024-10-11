function playAnimation(player, frames, room) {
    if (frames && frames.length > 0) {
        let frameIndex = 0;

        setTimeout(() => {
            const animation = setInterval(() => {
                if (frameIndex === frames.length) {
                    room.setPlayerAvatar(player, null)
                    clearInterval(animation)
                }
                room.setPlayerAvatar(player, frames[frameIndex])
                frameIndex++
            }, 1000);
        }, 1000)
    }
}

module.exports = { playAnimation };