const webpack = require('webpack')
const path = require('path')

// variables
const isProduction = process.env.NODE_ENV === 'production'
const sourcePath = path.join(__dirname, './src')
const outPath = path.join(__dirname, './dist')
const nodePath = path.join(__dirname, './node_modules')

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')

const basePlugins = [
  new WebpackCleanupPlugin(),
  new ExtractTextPlugin({
    filename: 'styles.css',
  }),
  new HtmlWebpackPlugin({
    title: 'WWII Online WebMap',
    template: 'assets/index.html',
    production: isProduction,
  }),
]

const plugins = isProduction ? basePlugins.concat([]) : basePlugins.concat([
  new webpack.HotModuleReplacementPlugin({
    // Options...
  })
])

module.exports = {
  context: sourcePath,
  devtool: isProduction ? 'source-map' : 'eval',
  entry: {
    main: './main.jsx',
  },
  output: {
    path: outPath,
    filename: 'bundle.js',
    chunkFilename: '[chunkhash].js',
    publicPath: '/',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.jsx', '.js', '.json'],
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
        test: /\.(css|sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: !isProduction,
                importLoaders: 1,
                localIdentName: '[local]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('postcss-import')({
                    addDependencyTo: webpack
                  }),
                  require('postcss-url')(),
                  require('postcss-cssnext')(),
                  require('postcss-reporter')(),
                  require('postcss-browser-reporter')({
                    disabled: isProduction,
                  }),
                  require('postcss-inline-svg')({
                    path: './src',
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: isProduction ? 'collapsed' : 'expanded',
                sourceMap: isProduction,
                includePaths: [sourcePath, nodePath],
              },
            },
          ],
        }),
      },
      // static assets
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(png|svg)$/,
        use: 'url-loader?limit=10000'
      },
      {
        test: /\.(jpg|gif)$/,
        use: 'file-loader'
      },
      {
        test: /\.[ot]tf$/,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 65000,
            mimetype: 'application/octet-stream',
            name: 'static/font/[name].[ext]',
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
            name: 'static/font/[name].[ext]',
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
            name: 'static/font/[name].[ext]',
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
  plugins: plugins,
  devServer: {
    contentBase: sourcePath,
    hot: !isProduction,
    inline: true,
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
