const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩 css
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isProd = process.env.NODE_ENV === 'production'
const basePlugins = [
  new CleanWebpackPlugin(), // 默认情况下，此插件将删除 webpack output.path目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
  new VueLoaderPlugin(),
  new MiniCssExtractPlugin({
    filename: 'ui.css',
    chunkFilename: 'ui.css'
  }),
  // 压缩 css
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g, //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
    cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
    cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
    canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为 true
  }),
]
const devPlugins = [
]
const prodPlugins = [
    // 压缩文件
    new UglifyJSPlugin({
      parallel: 4,
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false
        }
      },
      cache: true
    })
]
let plugins = [...basePlugins].concat(isProd ? prodPlugins : devPlugins)

module.exports = {
  entry: {
    app: './src/index.js' // 需要打包的文件入口
  },
  output: {
    publicPath: __dirname + '/lib/', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'lib/'), // 打包文件的输出目录
    filename: 'ui.js', // 打包后生产的 js 文件
    libraryTarget: "umd",
    library: "ui"   
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 使用正则来匹配 js 文件
        exclude: /node_modules/, // 排除依赖包文件夹
        use: {
          loader: 'babel-loader' // 使用 babel-loader
        }
      },
      {
        test: /\.(scss|css)$/, // 针对 .scss 或者 .css 后缀的文件设置 loader
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader' // 使用 sass-loader 将 scss 转为 css
        ],
        //合并css打包
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
        //合并css打包
      },
      {
        test : /\.vue$/,
        loader : 'vue-loader'
      }
    ]
  },
  plugins: plugins
}
