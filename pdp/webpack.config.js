const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = (_, argv) => ({
  output: {
    publicPath:
      argv === "development"
        ? "http://localhost:3001/"
        : "http://www.microfespdp.io.s3-website-us-east-1.amazonaws.com/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3001,
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
      name: "pdp",
      filename: "remoteEntry.js",
      remotes: {
        home:
          argv.mode === "development"
            ? "home@http://localhost:3000/remoteEntry.js"
            : "home@http://www.microfes.io.s3-website-us-east-1.amazonaws.com/remoteEntry.js",
        pdp:
          argv.mode === "development"
            ? "pdp@http://localhost:3001/remoteEntry.js"
            : "pdp@http://www.microfespdp.io.s3-website-us-east-1.amazonaws.com/remoteEntry.js",
        cart:
          argv.mode === "development"
            ? "cart@http://localhost:3002/remoteEntry.js"
            : "cart@http://www.microfescart.io.s3-website-us-east-1.amazonaws.com/remoteEntry.js",
        addtocart:
          argv.mode === "development"
            ? "addtocart@http://localhost:3003/remoteEntry.js"
            : "addtocart@http://www.microfesaddtocart.io.s3-website-us-east-1.amazonaws.com/remoteEntry.js",
      },
      exposes: {
        "./PDPContent": "./src/PDPContent.jsx",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
});
