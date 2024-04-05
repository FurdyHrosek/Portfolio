const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/js'),
    publicPath: '/dist/js/'
  },
  devServer: {
    static: './dist',
    compress: true,
    port: 8080,
    proxy: [{
      context: ['/'],
      target: 'http://localhost:80'
    }],
    watchContentBase: true, // Watch HTML files for changes
  }, 
  externalsPresets: { node: true },
  externals: [webpackNodeExternals()],
  plugins: [
    new NodePolyfillPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
