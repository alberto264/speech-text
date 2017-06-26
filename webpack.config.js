const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const identity = i => i;

module.exports = env => {
  console.log('Env is ' + env);

  const ifDev = then => (env === 'dev' ? then : null);
  const ifProd = then => (env === 'prod' ? then : null);

  return {
    target: 'web',
    profile: true,
    entry: [ifDev('react-hot-loader/patch'),'./appLoader'].filter(identity),
    performance: { hints: false },
    context: path.resolve(__dirname, './src'),
    devtool: env === 'dev' ? 'cheap-module-source-map' : false,
    resolve: { modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, './assets'), 'node_modules'] },
    output: { path: path.resolve(__dirname, './dist'), filename: env === 'dev' ? 'app.bundle.js' : 'app.bundle.[chunkhash].js', },
    plugins: [
      ifProd(new CleanWebpackPlugin(['dist/*.*'], { verbose: true, })),
      ifProd(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false})),
      new webpack.EnvironmentPlugin({ DEBUG: env === 'dev', NODE_ENV: env === 'dev' ? 'development' : 'production' }),
      new HtmlWebpackPlugin({ template: 'index.html', inject: true, minify: { collapseWhitespace: true } }),
      ifDev(new webpack.HotModuleReplacementPlugin()),
      ifDev(new webpack.NamedModulesPlugin()),
      ifProd(new ExtractTextPlugin('app.bundle.[contenthash].css')),
      ifProd(new BabiliPlugin({}, { comments: false }))
    ].filter(identity),
    devServer: {
      port: 80,
      host: '0.0.0.0',
      hot: true,
      compress: true,
      historyApiFallback: true,
      disableHostCheck: true,
      contentBase: path.resolve(__dirname, './dist'),
      overlay: { warnings: true, errors: true },
    },
    module: {
      rules: [{
        test: /\.js$/,
        include: [path.resolve(__dirname,'./src') ],
        use: 'babel-loader'
      },{
        test: /\.css$/,
        use: env === 'dev'
          ? ['style-loader', { loader: 'css-loader', options: { sourceMap: true }}]
          : ExtractTextPlugin.extract({ use: { loader: 'css-loader', options: { minimize: {discardComments: { removeAll: true}} } } })
      },{
        test: /\.(png|svg|jpg|gif)$/,
        use: [{ loader: 'url-loader', options: { limit: 4096 } }]
      },{
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
      ]
    }
  };
};