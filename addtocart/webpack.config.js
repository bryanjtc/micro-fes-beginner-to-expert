const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = (_, argv) => ({
  output: {
    publicPath:
      argv.mode === "development"
        ? "http://localhost:3003/"
        : "http://www.microfesaddtocart.io.s3-website-us-east-1.amazonaws.com/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3003,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        loader: "esbuild-loader",
        options: {
          loader: "jsx", // Remove this if you're not using JSX
          target: "es2015", // Syntax to compile to (see options below for possible values)
        },
      },
      {
        test: /\.(ts|tsx)$/,
        loader: "esbuild-loader",
        options: {
          loader: "tsx", // Or 'ts' if you don't need tsx
          target: "es2015",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "addtocart",
      filename: "remoteEntry.js",
      remotes: {
        cart:
          argv.mode === "development"
            ? "cart@http://localhost:3002/remoteEntry.js"
            : "cart@http://www.microfesaddtocart.io.s3-website-us-east-1.amazonaws.com/remoteEntry.js",
      },
      exposes: {
        "./AddToCart": "./src/AddToCart.jsx",
        "./placeAddToCart": "./src/placeAddToCart.js",
      },
      shared: {
        ...deps,
        "solid-js": {
          singleton: true,
          requiredVersion: deps["solid-js"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
});
