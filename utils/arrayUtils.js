function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Genera un índice aleatorio
        [array[i], array[j]] = [array[j], array[i]];   // Intercambia los elementos
    }
    return array;
}

function getRandom(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}


module.exports = { shuffleArray, getRandom };