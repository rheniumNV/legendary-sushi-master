import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration } from "webpack";
import { Configuration as WebpackDevServerConfig } from "webpack-dev-server";

const isDevelopment = process.env.NODE_ENV !== "production";

const clientConfig: Configuration & { devServer?: WebpackDevServerConfig } = {
  mode: isDevelopment ? "development" : "production",
  entry: "./src/client/index.tsx",
  cache: true,
  target: "web",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
  },
  module: {
    rules: [
      { test: /\.(png)$/, use: ["file-loader"] },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@emotion/babel-preset-css-prop",
              ],
            },
          },
          "ts-loader",
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/client/index.html" })],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".png"],
    modules: [
      path.resolve(__dirname, "./src"),
      path.resolve(__dirname, "./node_modules"),
    ],
  },
  devServer: {
    port: "3001",
    hot: true,
    open: true,
    static: {
      directory: path.resolve(__dirname, "./build"),
    },
  },
};

export default clientConfig;
