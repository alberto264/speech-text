require('env2')('./env.json');

const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const ifDev = (then) => (isDev ? then : null);
const ifProd = (then) => (!isDev ? then : null);

module.exports = {
  target: 'web',
  profile: true,
  mode: isDev ? 'development' : 'production',
  entry: [ifDev('webpack-hot-middleware/client'), './appLoader'].filter(_.identity),
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: { safari10: true, ie8: false, toplevel: true }
      })
    ]
  },
  performance: { hints: false },
  context: path.resolve(__dirname, './src'),
  devtool: isDev ? 'cheap-module-source-map' : false,
  output: { publicPath: '/', path: path.resolve(__dirname, './dist'), filename: isDev ? 'app.bundle.js' : 'app.bundle.[hash].js', },
  resolve: {
    modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, './assets'), 'node_modules'],
    alias: {
      '@': path.resolve(__dirname, './src'), // include your file like this in less files: ~@/yourFile.less
      '../../theme.config$': path.join(__dirname, './src/theme/semantic/theme.config.less'), //semantic requirement
    }
  },
  plugins: [
    ifProd(new CleanWebpackPlugin(['dist/*.*', 'logs/*.*'], { verbose: true, beforeEmit: true })),
    ifProd(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false })),
    new webpack.EnvironmentPlugin({ DEBUG: isDev, NODE_ENV: isDev ? 'development' : 'production' }),
    new CircularDependencyPlugin({ exclude: /node_modules/, failOnError: true, cwd: path.resolve(__dirname, './src') }),
    new HtmlWebpackPlugin({ template: 'index.html', inject: true, minify: { collapseWhitespace: true } }),
    ifDev(new webpack.HotModuleReplacementPlugin()),
    new ExtractTextPlugin({ filename: 'app.bundle.[hash].css', disable: isDev }),
  ].filter(_.identity),
  module: {
    rules: [{
      test: /\.js$/,
      include: [path.resolve(__dirname, './src')],
      use: [{ loader: 'babel-loader' }]
    }, {
      test: /\.(css|less)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader', options: { importLoaders: 2, sourceMap: isDev } },
          { loader: 'postcss-loader', options: { ident: 'postcss', sourceMap: isDev, plugins: () => [
            require('postcss-custom-media')(),
            ifProd(require('cssnano')())
          ].filter(_.identity) } },
          { loader: 'less-loader', options: { noIeCompat: true, sourceMap: isDev } }
        ]
      })
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$|\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [{ loader: 'file-loader', options: { name: '[name].[hash].[ext]' } }]
    }]
  }
};