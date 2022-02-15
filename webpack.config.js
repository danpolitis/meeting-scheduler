var path = require('path');
var SRC_DIR = path.join(__dirname, 'client/src/index.jsx');
var DIST_DIR = path.join(__dirname, '/client/dist');

module.exports = {
  entry: SRC_DIR,
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ]
      },
      {
        test: /\.(eot|svg|woff|woff2)$/,
        use: "url-loader?name=[name].[ext]"
      }
    ]
  },

  resolve: {
    alias: {
        'inferno': 'inferno/dist/index.dev.esm.js',
    },
},
}
