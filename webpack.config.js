var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, 'app/index.js'),
    output: {path: path.resolve(__dirname, 'build'), filename: 'bundle.js'},
    module: {
        preLoaders: [
            {
                test: /(\.js$|\.jsx$)/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-0', 'stage-1']
                }
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }
        ]
    },
    eslint: {
        configfile: '.eslintrc'
    },
};
