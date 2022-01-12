// const path = require('path');
import path from "path";

export default { //module.exports = { // export default
  entry: './srcFrontend/index.js',
  mode:"development",
  output: {
    filename: 'bundle.js',
    path: path.resolve(".", 'dist'), //__dirname
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};