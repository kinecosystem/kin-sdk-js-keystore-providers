const path = require("path");
const  glob = require("glob");

module.exports = {
  entry: glob.sync("./scripts/src/*.ts").reduce((obj, el) =>{
    obj[path.parse(el).name] = el;
    return obj
 },{}),
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
    path: path.resolve(__dirname, "dist")
  }
};
