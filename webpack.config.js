const path = require("path");

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
    path: path.resolve(__dirname, "public")
  }
};
