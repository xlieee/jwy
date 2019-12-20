const CompressionWebpackPlugin = require('compression-webpack-plugin')
const chalk = require('chalk')
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const { npm_package_name, npm_config_argv = '{}' } = process.env
let [isBuild, env] = JSON.parse(npm_config_argv).original || []
env = env ? env.replace(/-*/, '') : (isBuild === 'build' ? 'test' : 'dev')

const apiName = `VUE_APP_${env.toUpperCase()}`
process.env.VUE_APP_BASE_URL = process.env[apiName]

if (process.env.VUE_APP_BASE_URL === 'undefined') {
  console.log(
    chalk.red(`不存在${apiName} 环境！`)
  )
  process.exit()
}
const outputDir = `${npm_package_name}-${env}`

class CreateFile {
  apply (compiler) {
    compiler.hooks.emit.tap(
      'CreateFile',
      (compilation) => {
        const str = `var GLOBAL_URL = "${process.env.NODE_ENV === 'development' ? '' : process.env.VUE_APP_BASE_URL}"`
        compilation.assets['custom.js'] = {
          source: function () {
            return str
          },
          size: function () {
            return str.length
          }
        }
      }
    )
  }
}
module.exports = {
  pages: {
    index: {
      entry   : 'src/pages/index/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks  : ['runtime', 'vue', 'viewDesign',  'chunk-vendors', 'chunk-common', 'index']
    },
    login: {
      entry   : 'src/pages/login/main.js',
      template: 'public/login.html',
      filename: 'login.html',
      chunks  : ['runtime', 'chunk-vendors', 'chunk-common', 'login']
    },
    admin: {
      entry   : 'src/pages/admin/main.js',
      template: 'public/admin.html',
      filename: 'admin.html',
      chunks  : ['runtime', 'vue', 'viewDesign',  'chunk-vendors', 'chunk-common', 'admin']
    }
  },
  outputDir,
  assetsDir          : 'static',
  productionSourceMap: false,
  lintOnSave         : 'error',
  
  css: {
    loaderOptions: {
      // 可用
      // less: {
      // 	modifyVars: {
      // 		'primary-color': 'red',
      // 	},
      // 	javascriptEnabled: true
      // },
      sass: {
        prependData: '@import "@/style/script.scss";'
      }
    }
  },
  transpileDependencies: [
    /\/node_modules\/view-design\//,
    'vue-echarts',
    'resize-detector'
  ],
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.delete('prefetch')
      config.plugins.delete('preload')
      config
        .plugin('CompressionWebpackPlugin')
        .use(CompressionWebpackPlugin)
        .tap(c => {
          c[0] = {
            test     : /\.(js|css|json|png)$/,
            threshold: 1024 * 50
          }
          return c
        })
      config.module
        .rule('images')
        .use('url-loader')
        .loader('url-loader')
        .tap(options => Object.assign(options, { limit: 800 }))

    }
    config.resolve.alias
      .set('_index', resolve('src/pages/index'))
      .set('_admin', resolve('src/pages/admin'))
    
  },
  configureWebpack: {
    optimization: {
      runtimeChunk: 'single',
      moduleIds   : 'hashed',
      splitChunks : {
        chunks            : 'all',
        maxInitialRequests: Infinity,
        minSize           : 20000,
        cacheGroups       : {
          echart: {
            name: 'echart',
            test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/
          },
          jquery: {
            name: 'jquery',
            test: /[\\/]node_modules[\\/](jquery)[\\/]/
          },
          viewDesign: {
            name: 'viewDesign',
            test: /[\\/]node_modules[\\/](view-design)[\\/]/
          },
          vue: {
            name: 'vue',
            test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/
          }
        }
      }
    },
    plugins: [
      new CreateFile()
    ]
  },
  devServer: {
    historyApiFallback: {
      verbose : true,
      rewrites: [
        { from: /^\/index.*$/, to: '/index.html' },
        { from: /^\/login.*$/, to: '/login.html' },
        { from: /^\/admin.*$/, to: '/admin.html' }
      ]
    },
    proxy: process.env.VUE_APP_BASE_URL
    // proxy: {
    //   '^/sys': {
    //     target      : process.env[`${apiName}_ZWY`],
    //     changeOrigin: true
    //   },
    //   '^/cms': {
    //     target      : process.env[`${apiName}_LJW06`],
    //     changeOrigin: true
    //   },
    //   '^/srm': {
    //     target      : process.env[`${apiName}_LJW07`],
    //     changeOrigin: true
    //   },
    //   '^/fileStore': {
    //     target      : process.env[`${apiName}_LJW10`],
    //     changeOrigin: true
    //   },
    //   '^/auth': {
    //     target      : process.env[`${apiName}_LJW02`],
    //     changeOrigin: true
    //   },
    //   '^/bpm': {
    //     target      : process.env[`${apiName}_ZWY08`],
    //     changeOrigin: true
    //   }
    // }
  }
}