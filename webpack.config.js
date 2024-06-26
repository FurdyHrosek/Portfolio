const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/js/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist/js'),
      publicPath: '/dist/js/'
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      compress: true,
      port: 8080,
      proxy: [{
        context: ['/'],
        target: 'http://localhost:80'
      }],
      hot: true
    },
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
        },
        {
          test: /\.html$/,
          use: ['html-loader']
        }
      ]
    },
    plugins: []
  };

  // Add CopyPlugin only in production mode
  if (isProduction) {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          { from: 'assets/images', to: '../images' },
          { from: 'src/html', to: '../html' },
          { from: 'src/scss', to: '../scss' }
        ],
      })
    );
  }

  return config;
};
