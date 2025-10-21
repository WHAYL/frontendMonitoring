
import filesize from "rollup-plugin-filesize";

import configList from "./rollupConfigBase.js";
configList.map((config, index) => {
  config.output.sourcemap = false;
  config.plugins = [
    ...config.plugins,
    filesize()
  ]

  return config;
})
export default configList;