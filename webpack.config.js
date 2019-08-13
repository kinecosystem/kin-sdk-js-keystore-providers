const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: {
    "kin-sdk-sample-keystore-provider": __dirname + "/index.ts"
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "./[name].js",
    library: 'KinSdkSimpleKeystoreProvider',
    globalObject: 'typeof self !== \'undefined\' ? self : this',
    path: path.resolve(__dirname, "public")
  }
};
