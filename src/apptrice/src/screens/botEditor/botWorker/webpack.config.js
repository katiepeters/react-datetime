const path = require('path');

module.exports = {
  // mode: 'development',
  devtool: 'none',
  entry: path.resolve(__dirname, './botWorkerSource.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
					loader: 'ts-loader',
					options: {
						configFile: path.resolve(__dirname, '../../../../../tsconfig.botWorker.json')
					}
				},
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'wwph.js', // web worker placeholder
    path: path.resolve(__dirname, '../../../../public'),
  },
};