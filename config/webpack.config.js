module.exports = {
  entry: './src/index.jsx',
  module: {
      rules: [
        {
          test: /\.jsx?/i,
          exclude: /node_modules/,
          use: {
              loader: "babel-loader",
	      options: {
		  presets: ["@babel/preset-env", "@babel/preset-react"]
	      }
          }
        }
      ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
