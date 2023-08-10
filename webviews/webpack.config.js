const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const path = require('path');
const sassLoader = {
    // Compiles Sass to CSS
    loader: 'sass-loader',
    options: {
        sassOptions: { includePaths: ['node_modules'] }
    }
};

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        main: './src/main.ts',
        'charts': './src/components/charts/index.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.style\.(sass|scss)$/,
                use: ['style-loader', 'css-loader', sassLoader],
            },
            {
                test: /\.component\.(sass|scss)$/,
                use: ['css-loader', sassLoader],
            },
            {
                test: /\.style\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.component\.css$/,
                use: ['css-loader'],
            },
            {
                test: /\.html?$/,
                use: "html-loader",
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [new TsconfigPathsPlugin()]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
