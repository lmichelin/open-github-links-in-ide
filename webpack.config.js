const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const TerserJSPlugin = require("terser-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const ZipWebpackPlugin = require("zip-webpack-plugin")
const ExtensionReloader = require("webpack-extension-reloader")

const generatePlugins = (env, mode, browser) => {
  const plugins = [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "icons", to: "icons" },
        {
          from: "manifest.json",
          transform: content => {
            const manifest = {
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString()),
            }
            if (mode === "development" || env.test) {
              manifest.content_scripts.forEach(script => {
                script.all_frames = true // allow cypress tests
              })
            }
            if (browser === "firefox") {
              manifest.browser_specific_settings = {
                gecko: { id: process.env.npm_package_geckoId },
              }
              // Allow extension to fetch localhost URLs on Firefox (permission not needed on Chrome)
              // https://github.com/github/fetch/issues/310#issuecomment-454662463
              manifest.permissions.push("*://localhost/*")
            }
            return Buffer.from(JSON.stringify(manifest))
          },
        },
      ],
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "popup.html",
      filename: "popup.html",
      chunks: ["popup"],
    }),
  ]

  if (mode === "development") {
    plugins.push(
      new ExtensionReloader({
        port: browser === "chrome" ? 9090 : 9091,
        reloadPage: true,
        manifest: "./src/manifest.json",
      }),
    )
  }

  if (mode === "production") {
    plugins.push(
      new ZipWebpackPlugin({
        path: path.join(__dirname, "build"),
        exclude: [/\.map$/],
        filename: `${browser}.zip`,
      }),
    )
  }

  return plugins
}

const generateWebpackConfig = (env, mode, browser) => {
  return {
    stats: "minimal",
    devtool: mode === "development" ? "inline-source-map" : "source-map",
    watch: mode === "development",
    context: path.join(__dirname, "src"),
    output: { path: path.join(__dirname, `dist/${browser}`) },
    entry: {
      inject: "./inject.ts",
      background: "./background.ts",
      popup: "./popup.ts",
    },
    module: {
      rules: [
        { test: /\.ts$/, loader: "ts-loader" },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
      ],
    },
    resolve: { extensions: [".js", ".ts"] },
    optimization: {
      minimizer: [
        new TerserJSPlugin({ sourceMap: true, terserOptions: { output: { comments: false } } }),
        new OptimizeCssAssetsPlugin(),
      ],
    },
    plugins: generatePlugins(env, mode, browser),
  }
}

module.exports = (env = {}, argv) => [
  generateWebpackConfig(env, argv.mode, "chrome"),
  generateWebpackConfig(env, argv.mode, "firefox"),
]
