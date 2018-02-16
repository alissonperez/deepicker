const config = require('./package.json').config
const path = require('path')

const webpack = require('webpack')

module.exports = function(env = {}) {
  const plugins = {
    moduleConcatenation: new webpack.optimize.ModuleConcatenationPlugin(),
    uglify: new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      test: /min.js$/i,
    })
  }

  return {
    entry: {
      'deepicker': path.resolve(__dirname, config.path.src, 'browser'),
      'deepicker.min': path.resolve(__dirname, config.path.src, 'browser'),
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, config.path.output),
    },

    resolve: {
      modules: config.path.ignore,
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|\.spec\.js)/,
          include: path.resolve(__dirname, config.path.src),
          enforce: 'pre',
          use: [{ loader: 'eslint-loader' }],
        },
        {
          test: /\.js$/,
          exclude: /node_modules|\.spec\.js/,
          include: path.resolve(__dirname, config.path.src),
          use: [{ loader: 'babel-loader' }],
        },
      ],
    },

    devtool: 'source-map',

    plugins: env.dev ? [
      plugins.moduleConcatenation,
    ] : [
      plugins.moduleConcatenation,
      plugins.uglify,
    ],
  }
}
