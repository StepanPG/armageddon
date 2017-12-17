const path = require('path');

module.exports = {
    entry: './src/game/js/main.js',
    output: {
        filename: 'game.js',
        path: path.resolve(__dirname, 'dist')
    }
};
