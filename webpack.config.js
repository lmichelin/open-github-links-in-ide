const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const TerserJSPlugin = require("terser-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const ZipWebpackPlugin = require("zip-webpack-plugin")
const ExtReloader = require("webpack-ext-reloader")

const generatePlugins = (env, mode, browser) => {
  const plugins = [
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

              // Firefos is not compatible with the manifest V3
              manifest.manifest_version = 2
              manifest.background = { scripts: [manifest.background.service_worker], persistent: false }
              manifest.web_accessible_resources = manifest.web_accessible_resources[0].resources
              manifest.browser_action = manifest.action
              delete manifest.action

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
      new ExtReloader({
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
        forceZip64Format: true,
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
    output: { path: path.join(__dirname, `dist/${browser}`), filename: "[name].js", clean: true },
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
      minimizer: [new TerserJSPlugin({ terserOptions: { output: { comments: false } } }), new CssMinimizerPlugin()],
    },
    plugins: generatePlugins(env, mode, browser),
  }
}

module.exports = (env = {}, argv) => [
  generateWebpackConfig(env, argv.mode, "chrome"),
  generateWebpackConfig(env, argv.mode, "firefox"),
]
