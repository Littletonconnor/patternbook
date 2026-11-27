const path = require("path");

const dev = process.env.NODE_ENV !== "production";

const stylexOptions = {
  dev,
  runtimeInjection: false,
  treeshakeCompensation: true,
  aliases: { "@/*": [path.join(__dirname, "src", "*")] },
  unstable_moduleResolution: { type: "commonJS" },
};

const nextConfig = {
  presets: ["next/babel"],
  plugins: [["@stylexjs/babel-plugin", stylexOptions]],
};

const vitestRunsItsOwnStylexTransform = (caller) => caller?.name === "@stylexjs/unplugin";

module.exports = (api) => (api.caller(vitestRunsItsOwnStylexTransform) ? {} : nextConfig);
module.exports.plugins = nextConfig.plugins;
