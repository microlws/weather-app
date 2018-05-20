const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const sourcePath = path.join(__dirname, './src')
const outPath = path.join(__dirname, './dist')
const nodePath = path.join(__dirname, './node_modules')



module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  const basePlugins = [
    new WebpackCleanupPlugin(),
    new MiniCssExtractPlugin({
      filename: !isProduction ? '[name].css' : '[name].[hash:8].css',
      chunkFilename: !isProduction ? '[id].css' : '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Weather App',
      template: 'index.html',
      production: isProduction,
      inject: isProduction ? 'body' : true,
    }),
  ]

  const plugins = isProduction ? basePlugins.concat([
    new CopyWebpackPlugin([{
      from: 'assets',
      to: 'assets',
      toType: 'dir'
    }])
  ]) : basePlugins.concat([
    new webpack.HotModuleReplacementPlugin({
      // Options...
    })
  ])

  return {
    context: sourcePath,
    devtool: isProduction ? 'source-map' : 'eval',
    entry: {
      main: ['babel-polyfill', './main.jsx'],
    },
    output: {
      path: outPath,
      filename: 'bundle.js',
      chunkFilename: '[chunkhash].js',
      publicPath: '/',
    },
    target: 'web',
    resolve: {
      extensions: ['.js', '.jsx', '.js', '.json', '.scss'],
      alias: {
        component: path.resolve('./src/component/'),
        container: path.resolve('./src/container/'),
        tools: path.resolve('./src/tools/'),
        assets: path.resolve('./src/assets/'),
        scss: path.resolve('./src/scss/'),
      },
    },
    module: {
      rules: [
        // .js, .jsx
        {
          // Include js, jsx, and files.
          test: /\.(jsx?)|(js)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        // css
        {
          test: /\.s?[ac]ss$/,
          use: [!isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        },
        // static assets
        {
          test: /\.html$/,
          use: 'html-loader'
        },
        {
          test: /\.(png|svg|jp(e)g|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              limit: 65000,
              name: 'assets/image/[name].[ext]',
            },
          },
        },
        {
          test: /\.[ot]tf$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'application/octet-stream',
              name: 'assets/font/[name].[ext]',
            },
          },
        },
        {
          test: /\.woff$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'application/font-woff',
              name: 'assets/font/[name].[ext]',
            },
          },
        },
        {
          test: /\.woff2$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'application/font-woff2',
              name: 'assets/font/[name].[ext]',
            },
          },
        },
      ],
    },
    optimization: {
      splitChunks: {
        name: true,
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: -10,
          },
        },
      },
      runtimeChunk: true,
    },
    plugins,
    devServer: {
      contentBase: sourcePath,
      hot: !isProduction,
      inline: !isProduction,
      historyApiFallback: {
        disableDotRule: true,
      },
      stats: 'minimal',
    },
    node: {
      fs: 'empty',
      net: 'empty',
    },
  }
}
