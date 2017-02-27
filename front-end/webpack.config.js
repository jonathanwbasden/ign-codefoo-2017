var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');


var config = {
   entry: APP_DIR+'/js/index.js',
	
   output: {
      path: BUILD_DIR,
      filename: 'bundle.js',
   },

   resolve: {
    extensions: ['', '.js', '.jsx']
   },
	
   devServer: {
      inline: true,
      port: 8081
   },
	
   module: {
      loaders: [
            {
              test: /.jsx?$/,
              loader: 'babel-loader',
              exclude: /node_modules/,
              query: {
                presets: ['es2015', 'react', 'stage-1']
              }
            },
            { 
              test: /\.css$/, 
              loader: "style-loader!css-loader" 
            },
            { 
              test: /\.png$/, 
              loader: "url-loader?limit=100000" 
            },
            { 
              test: /\.jpg$/, 
              loader: "file-loader" 
            },
            {
              test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
              loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
              test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
              loader: 'url?limit=10000&mimetype=application/octet-stream'
            },
            {
              test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
              loader: 'file'
            },
            {
              test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
              loader: 'url?limit=10000&mimetype=image/svg+xml'
            }
       ]
   }
}

module.exports = config;
