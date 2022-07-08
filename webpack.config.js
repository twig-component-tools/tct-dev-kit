const Encore = require('@symfony/webpack-encore')
const path = require('path')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')

Encore
  .enableSingleRuntimeChunk()
  .splitEntryChunks()

  .configureSplitChunks(options => {
    Object.assign(options, {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      minChunks: 2,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name (module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1].replace('@', '')
            return `vendor/${packageName}`
          }
        }
      }
    })
  })

  .setOutputPath('public/build/')
  .setPublicPath('/build')
  .setManifestKeyPrefix('build')

  .cleanupOutputBeforeBuild()

  .addEntry('app', './assets/app.js')
  .addEntry('header', './assets/header.js')

  .enableSassLoader()
  .enableSourceMaps(Encore.isDev())

  .configureImageRule({
    type: 'asset',
    maxSize: 8 * 1024,
    filename: 'images/[name].[contenthash:8][ext]'
  })

  .configureFontRule({
    type: 'asset',
    filename: 'fonts/[name].[contenthash:8][ext]'
  })

  .addRule({
    resourceQuery: /raw/,
    type: 'asset/source'
  })

  .configureLoaderRule('css', config => {
    config.resourceQuery = { not: [/raw/] }
  })

  .addPlugin(new RemoveEmptyScriptsPlugin({ verbose: false }))

if (Encore.isDevServer()) {
  Encore.addPlugin(new WebpackWatchedGlobEntries())
}

if (Encore.isProduction()) {
  Encore
    .enablePostCssLoader()
    .enableVersioning()
    .configureTerserPlugin(function (options) {
      options.extractComments = false
      options.parallel = true
      options.terserOptions = {
        keep_classnames: false,
        mangle: true,
        compress: false,
        keep_fnames: false,
        output: {
          comments: false
        }
      }
    })
    .configureFilenames({
      js: '[name].[contenthash:8].js',
      css: '[name].[contenthash:8].css'
    })
}

if (process.env.ANALYZE) {
  Encore.addPlugin(new BundleAnalyzerPlugin())
}

const config = Encore.getWebpackConfig()

config.entry = WebpackWatchedGlobEntries.getEntries(
  [
    path.resolve(__dirname, 'assets/components/**/*.js'),
    path.resolve(__dirname, 'assets/components/**/*.scss'),
    path.resolve(__dirname, 'assets/app.js'),
    path.resolve(__dirname, 'assets/scss/head.scss')
  ],
  {
    // Optional glob options that are passed to glob.sync()
    ignore: [
      '**/*.stories.js',
      '**/_copy/**/*'
    ]
  },
  {
    basename_as_entry_name: true
  }
)

module.exports = config
