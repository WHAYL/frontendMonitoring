import configList from "./rollupConfigBase.js";
configList.map((config, index) => {
  config.output.sourcemap = true;
  config.plugins = [
    ...config.plugins,
  ]

  return config;
})
export default configList;