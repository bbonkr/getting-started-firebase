const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const CopyPlugin = require('copy-webpack-plugin');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    name: 'build resume',
    devtool: isProduction ? 'hidden-source-map' : 'eval',
    mode: isProduction ? 'production' : 'development',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    entry: {
        app: path.join(path.resolve(__dirname, '..'), 'src', 'index'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    !isProduction && {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['react-refresh/babel'],
                        },
                    },
                    'ts-loader',
                ].filter(Boolean),
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({ dev: !isProduction }),
        // new webpack.DefinePlugin({
        //     GAID: JSON.stringify(process.env.GAID),
        // }),
        new HtmlWebPackPlugin({
            template: 'src/index.html',
            filename: '../index.html',
            templateParameters: {
                // gaid: process.env.GAID,
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(path.resolve(__dirname, '..'), 'public'),
                    to: '../',
                },
            ],
        }),
    ],
    output: {
        filename: '[name].js',
        path: path.join(path.resolve(__dirname, '..'), 'docs', 'dist'),
        publicPath: '/dist/',
    },
};
