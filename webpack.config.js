require('env2')('./env.json');

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const ifDev = (then) => (isDev ? then : null);
const ifProd = (then) => (!isDev ? then : null);
const identity = (i) => i;

module.exports = {
  target: 'web',
  profile: true,
  entry: [ifProd('@babel/polyfill'), ifDev('webpack-hot-middleware/client'), ifDev('react-hot-loader/patch'), './appLoader'].filter(identity),
  performance: { hints: false },
  context: path.resolve(__dirname, './src'),
  devtool: isDev ? 'cheap-module-source-map' : false,
  output: { publicPath: '/', path: path.resolve(__dirname, './dist'), filename: isDev ? 'app.bundle.js' : 'app.bundle.[hash].js', },
  resolve: {
    modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, './assets'), 'node_modules'],
    alias: {
      '@': path.resolve(__dirname, './src') // include your file like this in less files: ~@/yourFile.less
    }
  },
  plugins: [
    ifProd(new CleanWebpackPlugin(['dist/*.*', 'logs/*.*'], { verbose: true, beforeEmit: true })),
    ifProd(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false })),
    new webpack.EnvironmentPlugin({ DEBUG: isDev, NODE_ENV: isDev ? 'development' : 'production' }),
    new HtmlWebpackPlugin({ template: 'index.html', inject: true, minify: { collapseWhitespace: true } }),
    ifDev(new webpack.HotModuleReplacementPlugin()),
    ifDev(new webpack.NamedModulesPlugin()),
    new ExtractTextPlugin({ filename: 'app.bundle.[contenthash].css', disable: isDev }),
    ifProd(new UglifyJsPlugin({ parallel: true, cache: true }))
  ].filter(identity),
  module: {
    rules: [{
      test: /\.js$/,
      include: [path.resolve(__dirname, './src') ],
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          babelrc: false,
          'presets': [
            ['@babel/preset-env',
              { useESModules: true, debug: true, loose: true, useBuiltIns: false, modules: false, targets: isDev ? { chrome: 64 } : { browsers: ['> 1%'] } }],
            '@babel/preset-react'
          ],
          'plugins': [
            '@babel/plugin-proposal-decorators',
            '@babel/plugin-transform-spread',
            '@babel/plugin-proposal-object-rest-spread',
            ['@babel/plugin-proposal-class-properties', { loose: true } ]
          ]
        }
      }]
    }, {
      test: /\.(css|less)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader', options: { sourceMap: isDev, minimize: isDev ? false : { discardComments: { removeAll: true } } } },
          { loader: 'less-loader', options: { noIeCompat: true, sourceMap: isDev } }
        ]
      })
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
      use: [{ loader: 'url-loader', options: { limit: 4096, name: '[name].[hash].[ext]' } }]
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [{ loader: 'file-loader', options: { name: '[name].[hash].[ext]' } }]
    }]
  }
};