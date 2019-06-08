const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	mode: process.env.NODE_ENV,
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/react'],
            plugins: ['dynamic-import-webpack']
          }
        }
      },
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        loader: 'file-loader',
        options: {
          name: '[name]-[hash].[ext]',
        }
      },
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx']
	},
	optimization: {
    minimizer: [new UglifyJsPlugin()],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
	},
	output: {
    filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'build/static/js/'),
		publicPath: '/static/js/',
  },
  watch: process.env.NODE_ENV == 'development',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: ['build', 'node_modules', '*.cpp', '*.wasm', 'shapes']
  },
  node: {
    fs: 'empty',
  }
};