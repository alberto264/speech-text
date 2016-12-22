import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import config from './webpack.config';
import chalk from 'chalk';
import open from 'open';

console.log(chalk.blue('Starting WebpackDevServer debug'));

try {

  const compiler = webpack(config({isDev: true}));

  const server = new WebpackDevServer(compiler,{
    contentBase: './dist',
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: { colors: true, assets: false },
  });

  server.listen(80,'0.0.0.0', () => {
    console.log(chalk.green('Listening on port 80'));
    open('http://localhost');
  });

} catch (ex) {
  console.log(chalk.red(`The following error has ocurred: ${ex}`));
}