const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = path.resolve(__dirname, "src");
const furmly = path.resolve(__dirname, "./node_modules/<%= component %>/dist");
const furmlyClient = path.resolve(
  __dirname,
  "./node_modules/furmly-client/dist"
);
const furmlyFonts = furmly + "\\*.ttf";
 <%if (hasWorker) { %>
const worker = furmly + "/worker.js";
 <% } %>
const dist = path.resolve(__dirname, "dist");

module.exports = {
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ],
        include: defaultInclude
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "module-resolver",
                  {
                    cwd: "babelrc",
                    alias: {
                      error_handler: "./src/errorhandler.js",
                      client_config: "./furmly-client.config.js"
                    }
                  }
                ]
              ]
            }
          }
        ],
        include: [defaultInclude, furmlyClient, furmly]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{ loader: "file-loader?name=img/[name]__[hash:base64:5].[ext]" }],
        include: defaultInclude
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          { loader: "file-loader?name=font/[name]__[hash:base64:5].[ext]" }
        ],
        include: [defaultInclude, furmly]
      }
    ]
  },
  target: "web",
  optimization: {
    minimize: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "<%= appName %>",
      appMountId: "root",
      template: "./src/assets/index.html",
      inject: false
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new MiniCssExtractPlugin({
        filename: "bundle.css",
        chunkFilename: "[id].css"
      }),
    new CopyPlugin([
      { from: furmlyFonts, to: dist, flatten: true },
      { from: furmly + "\\webfonts\\*", to: dist+"\\webfonts",flatten:true },
       <%if (hasWorker) { %>
      { from: worker, to: dist, flatten: true }
       <% } %>
    ])
  ],
  resolve: {
    alias: {
      "furmly-controls": path.resolve(__dirname, "src/furmly")
    }
  }
};
