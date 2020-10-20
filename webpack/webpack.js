const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const prod = process.env.NODE_ENV === 'production';

module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'),
    devtool: prod ? false : 'source-map',
    mode: prod ? 'production' : 'development',
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: prod ? 'index.min.js' : 'index.js',
        library: 'Webrix',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    externals: [
        'react',
        'react-dom',
    ],
    plugins: [
        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
        ]
    },
};
