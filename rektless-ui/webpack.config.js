const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: __dirname + '/src/App.jsx',
    output: {
        path: path.join(__dirname, "/build"),
        filename: 'main.[hash].js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            lessOptions: {
                                modifyVars: {
                                    "@primary-color": "#f76262",
                                    "@link-color": "#f76262",
                                    "@layout-body-background": "#f5f5f5",
                                    "@layout-header-background": "#ffffff",
                                    "@layout-header-height": "auto",
                                    "@layout-header-padding": "80",
                                    "@layout-footer-padding": "16px 0",
                                },
                                javascriptEnabled: true,
                            }
                        },
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    devServer: {
        historyApiFallback: true,
    },
    externals: {
        'Config': JSON.stringify(require('./config/default.json'))
    }
};