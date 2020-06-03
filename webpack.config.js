const path = require('path')
const webpack = require('webpack')

let config = {
  entry: path.resolve(__dirname, 'src') + '/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.main.js',
    publicPath: '/dist/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  devServer: {
    noInfo: true,
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      /*
      {
        test: /\.tsx?/,
        loader: 'tslint-loader',
        enforce: 'pre',
        exclude: [/node_module/],
      },*/
      {
        test: /\.tsx?/,
        loader: 'ts-loader',
        exclude: [/node_module/],
      },

      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: [/node_module/],
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
        exclude: [/node_module/],
      },
      {
        test: /\.scss/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: [/node_module/],
        include: path.join(__dirname, 'src'),
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|mp3)$/,
        use: {
          loader: 'file-loader',
        },
        include: path.join(__dirname, 'src'),
        exclude: [/node_module/],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
}
module.exports = config
