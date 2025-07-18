const path = require('path');

module.exports = (env, argv) => {
    return  {
        mode: argv.mode || 'development',
        entry: path.resolve(__dirname, 'js', 'index.js'),
        devtool: 'source-map',
        output: {
            path: path.resolve(__dirname, 'files'),
            filename: 'main.js',
            clean: false,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
            ],
        },
    }
}
