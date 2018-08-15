'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

const cssFilename = '[name].css';

const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? // Making sure that the publicPath goes back to to build folder.
    { publicPath: Array(cssFilename.split('/').length).join('../') }
  : {};
module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  devtool: shouldUseSourceMap ? 'source-map' : false,
  entry: {
      index: [require.resolve('./polyfills'), paths.appIndexJs]
  },
  output: {
    path: paths.appBuild,
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'echarts': 'echarts',
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: ['.js', '.jsx', '.scss', '.css'], //后缀名自动补全
    alias:{
        Component:path.resolve(paths.appSrc,'Component'),
        Helper:path.resolve(paths.appSrc,'Helper'),
        Mock:path.resolve(paths.appSrc,'Mock'),
        Api:path.resolve(paths.appSrc,'API'),
        Style:path.resolve(paths.appSrc,'Style'),
        Container:path.resolve(paths.appSrc,'Container'),
        Images: path.resolve(paths.appSrc, 'Images'),
    },
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'images/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|jsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            query: {
              plugins: [
                ['import', [{ libraryName: 'antd', style: 'css' }]]
              ],
              //babelrc: true,
              cacheDirectory: true,
            },
            // options: {      
            //   compact: true,
            // },
          },
          {
            test: /\.(scss|css)$/,
            exclude: /node_modules/,
            loader: ExtractTextPlugin.extract(
              Object.assign(
                {
                  fallback: require.resolve('style-loader'),
                  use: [
                    {
                      loader: require.resolve('css-loader'),
                      options: {
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: shouldUseSourceMap,
                        modules: true,
                        localIdentName: '[name]_[local]_[hash:base64:5]'
                      },
                    },
                    {
                      loader: require.resolve('postcss-loader'),
                      options: {
                        ident: 'postcss',
                        plugins: () => [
                          require('postcss-flexbugs-fixes'),
                          autoprefixer({
                            browsers: [
                              '>1%',
                              'last 4 versions',
                              'Firefox ESR',
                              'not ie < 9', // React doesn't support IE8 anyway
                            ],
                            flexbox: 'no-2009',
                          }),
                        ],
                      },
                    },
                    require.resolve('sass-loader'),
                  ],
                },
                extractTextPluginOptions
              )
            ),
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: '[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin(env.raw),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.DefinePlugin(env.stringified),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
      sourceMap: shouldUseSourceMap,
    }),
    new ExtractTextPlugin({
      filename: cssFilename,
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'index_vendor',
    //   filename: '[name].js',
    //   //minChunks: Infinity,
    // }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    //new BundleAnalyzerPlugin(),
  ],

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
