const path = require('path');

module.exports = {
  mode: 'development', // or 'production' for production build
  entry: './src/js/index.js', // your main JavaScript file
  output: {
    filename: 'bundle.js', // output bundle name
    path: path.resolve(__dirname, 'dist/js'), // output directory for JS files
    publicPath: '/dist/js/' // public path used by webpack-dev-server
  },
  devServer: {
    static: './dist', // Replace contentBase with static
    compress: true, // enable gzip compression
    port: 8080, // serve webpack-dev-server on port 8080
    proxy: [{
      context: ['/'], // match all paths
      target: 'http://localhost:80' // proxy requests to port 80
    }]
  },  
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', // Inject CSS into the DOM
          'css-loader', // Turns CSS into commonjs
          'sass-loader' // Compiles Sass to CSS
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Transpile JS files using Babel
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
