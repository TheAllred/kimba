/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/*.css"],
  browserNodeBuiltinsPolyfill: {
    modules: {
      events: true, // Already present from previous configuration
      crypto: true,
      dns: true,
      fs: true,
      net: true,
      tls: true,
      path: true,
      stream: true,
      string_decoder: true,
      util: true,
    },
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
