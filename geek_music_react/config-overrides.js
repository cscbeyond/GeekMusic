/**
    const {override,addWebpackPlugin} = require('customize-cra');
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
    const path = require('path');
    module.exports = override(
    // 判断环境，只有在生产环境的时候才去使用这个插件
    // 如果不想这样做的话可以只修改build的命令为"build": "react-app-rewired build"
    process.env.NODE_ENV === 'production' && addWebpackPlugin(new UglifyJsPlugin({
        uglifyOptions: {
            compress: {
            drop_debugger: true,
            drop_console: true
            }
        }
        }),
        resolve: {
        "alias": path.resolve(__dirname, 'src/')
        }
    ),
    );
 */



var path = require('path')
const rewireWebpackBundleAnalyzer = require('react-app-rewire-webpack-bundle-analyzer')
const rewireLess = require('react-app-rewire-less')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

const {
  override,
  fixBabelImports,
  addWebpackPlugin,
  // addLessLoader,
} = require("customize-cra");

module.exports = function override(config, env) {
  fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: 'css' // change importing css to less
    }),

    process.env.NODE_ENV === 'production' && addWebpackPlugin(new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          drop_debugger: true,
          drop_console: true
        }
      }
    })),

    config.resolve.alias['@'] = resolve('src/'),

    return config
}
