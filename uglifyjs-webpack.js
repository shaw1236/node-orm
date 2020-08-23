// npm i -D uglifyjs-webpack-plugin
// change build/webpack.prod.conf.js

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

plugins: [
   new UglifyJsPlugin({
          uglifyOptions: {
          }
       },
       SourceMap: 
       parallel: true
   }),
]
        
