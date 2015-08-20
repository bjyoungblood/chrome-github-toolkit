import path from 'path';
import webpack from 'webpack';

const port = 3000;
const entry = [
  `webpack-dev-server/client?http://localhost:${port}`,
  'webpack/hot/only-dev-server'
];

export default {
  devtool: 'eval',
  entry: {
    background: [ path.join(__dirname, '../app/scripts/background'), ...entry ],
    options: [ path.join(__dirname, '../app/scripts/options'), ...entry ],
    popup: [ path.join(__dirname, '../app/scripts/popup'), ...entry ]
  },
  output: {
    path: path.join(__dirname, '../dev/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: `http://localhost:${port}/js/`
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel?stage=0'],
      exclude: /node_modules/
    }, {
      test: /\.css?$/,
      loaders: ['style', 'raw']
    }]
  },
  node: {
  // don't try to load these modules
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    fs: 'empty',
    child_process: 'empty'
  }
};
