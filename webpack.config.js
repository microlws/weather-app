/* eslint-disable comma-dangle */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const stylelintFormatter = require('stylelint-formatter-pretty');

const title = 'Jakobs Website';

// replace localhost with 0.0.0.0 if you want to access
// your app from wifi or a virtual machine
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;
const sourcePath = path.join(__dirname, './src');
const buildPath = path.join(__dirname, './build');
const nodePath = `${__dirname}/node_modules`;

// Function to check if entry is vendor for bundling
const isVendor = ({ resource }) => resource &&
  resource.indexOf('node_modules') >= 0 &&
  resource.match(/\.js$/);

module.exports = function webpackExport(env) {
  // Setup base variables
  const nodeEnv = env && env.prod ? 'production' : 'development';
  const isProduction = nodeEnv === 'production';
  const htmlTemplate = isProduction ? 'index.prod.ejs' : 'index.dev.ejs';

  const htmlMinify = isProduction && {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  };

  // Setup base plugin array
  const plugins = [
    // Setting production environment will strip out
    // some of the development code from the app and libraries
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),

    // Enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),

    // Create Vendor Chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.[chunkhash:8].js',
      minChunks: isVendor
    }),

    // Create Meta Chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'meta',
      chunks: ['vendor'],
      filename: 'meta.[hash:8].js'
    }),

    // show module names instead of numbers in webpack stats
    new webpack.NamedModulesPlugin(),

    // Create HTML file for index
    new HtmlWebpackPlugin({
      title,
      template: htmlTemplate,
      inject: false,
      production: isProduction,
      minify: htmlMinify
    }),

    // Extract styles and create CSS files
    new ExtractTextPlugin({
      allChunks: true,
      filename: '[name].[hash:8].css'
    }),

    // Set default script attributes
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async'
    }),
  ];

  // Push environment specific plugins
  if (isProduction) {
    plugins.push(
      new UglifyJSPlugin({ // Uglify, minimize and tree-shake JS code
        compress: {
          sequences: true, // join consecutive statemets with the “comma operator”
          properties: true, // optimize property access: a["foo"] → a.foo
          dead_code: true, // discard unreachable code
          drop_debugger: true, // discard “debugger” statements
          unsafe: false, // some unsafe optimizations (see below)
          conditionals: true, // optimize if-s and conditional expressions
          comparisons: true, // optimize comparisons
          evaluate: true, // evaluate constant expressions
          booleans: true, // optimize boolean expressions
          loops: true, // optimize loops
          unused: true, // drop unused variables/functions
          hoist_funs: true, // hoist function declarations
          hoist_vars: false, // hoist variable declarations
          if_return: true, // optimize if-s followed by return/continue
          join_vars: true, // join var declarations
          cascade: true, // try to cascade `right` into `left` in sequences
          side_effects: true, // drop side-effect-free statements
          warnings: true, // warn about potentially dangerous optimizations/code
          global_defs: {} // global definitions
        },
        sourceMap: true, // include a source map
        warningsFilter: false // Suppress the warning messages
      }),

      // Enable gzip compression for even smaller files
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        threshold: 10240,
        minRatio: 0.8
      })
    );
  } else {
    plugins.push(

      // make hot reloading work
      new webpack.HotModuleReplacementPlugin(),

      // don't spit out any errors in compiled assets
      new webpack.NoEmitOnErrorsPlugin(),

      // Add hot-loading stylelint output while in develop mode
      new StyleLintPlugin({
        formatter: stylelintFormatter
      })
    );
  }

  const getEntryPoint = (entryPath) => {
    const entryPoint = isProduction ? entryPath : [
      // activate HMR for React
      'react-hot-loader/patch',

      // bundle the client for webpack-dev-server
      // and connect to the provided endpoint
      `webpack-dev-server/client?http://${host}:${port}`,

      // bundle the client for hot reloading
      // only- means to only hot reload for successful updates
      'webpack/hot/only-dev-server',

      // the entry point of our app
      entryPath
    ];

    return entryPoint;
  };

  return {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    node: {
      dns: 'empty',
      fs: 'empty',
      net: 'empty'
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    context: sourcePath,
    resolve: {
      extensions: [
        '.webpack-loader.js', '.web-loader.js', '.loader.js',
        '.js', '.jsx',
        '.scss'
      ],
      modules: [
        path.resolve(__dirname, 'node_modules'),
        sourcePath
      ],
      alias: {
        domready: `${nodePath}/domready`,
        react: `${nodePath}/react`,
        'react-dom': `${nodePath}/react-dom`,
        'react-router-dom': `${nodePath}/react-router-dom`,
        scss: `${sourcePath}/scss`
      },
    },
    entry: {
      script: getEntryPoint('./index.jsx'),
      vendor: [
        'react', 'react-dom',
        'react-router-dom',
        'domready'
      ]
    },
    output: {
      path: buildPath,
      filename: '[name].[hash:8].js',
      chunkFilename: '[id].[hash:8].js',
      publicPath: '/'
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.[ot]tf$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'application/octet-stream',
              name: 'static/font/[name].[ext]'
            }
          }
        },
        {
          test: /\.woff$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'application/font-woff',
              name: 'static/font/[name].[ext]'
            }
          }
        },
        {
          test: /\.woff2$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'application/font-woff2',
              name: 'static/font/[name].[ext]'
            }
          }
        },
        {
          test: /\.jpeg$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/jpeg',
              name: 'static/image/[name].[ext]'
            }
          }
        },
        {
          test: /\.jpg$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/jpg',
              name: 'static/image/[name].[ext]'
            }
          }
        },
        {
          test: /\.png$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/png',
              name: 'static/image/[name].[ext]'
            }
          }
        },
        {
          test: /\.gif$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/gif',
              name: 'static/image/[name].[ext]'
            }
          }
        },
        {
          test: /\.(css|sass|scss)$/,
          exclude: /node_modules/,
          use: (() => {
            const styleLoader = {
              loader: 'style-loader'
            };

            const cssLoader = {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              },
            };

            const postcssLoader = {
              loader: 'postcss-loader'
            };

            const sassLoader = {
              loader: 'sass-loader',
              options: {
                outputStyle: isProduction ? 'collapsed' : 'expanded',
                sourceMap: isProduction,
                includePaths: [sourcePath]
              }
            };

            return ExtractTextPlugin.extract({
              fallback: styleLoader,
              use: [
                cssLoader,
                postcssLoader,
                sassLoader
              ]
            });
          })()
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
    },
    devServer: {
      contentBase: ['./src'],
      publicPath: '/',
      historyApiFallback: true,
      port,
      host,
      hot: !isProduction,
      compress: isProduction,
      stats: {
        assets: true,
        children: false,
        chunks: false,
        colors: true,
        depth: false,
        exclude: [/node_modules/, /webpack/],
        hash: true,
        modules: false,
        providedExports: true,
        publicPath: false,
        timings: false,
        usedExports: true,
        version: false,
        warnings: true
      }
    }
  };
};
