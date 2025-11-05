
import filesize from "rollup-plugin-filesize";

import configList from "./rollupConfigBase.js";
function uniAppPreprocessor(platform) {
  return {
    name: 'uniapp-preprocessor',
    transform(code, id) {
      if (!id.includes('node_modules')) {
        // 处理条件编译
        const platformPattern = new RegExp(`//\\s*#ifdef\\s+${platform}[\\s\\S]*?//\\s*#endif`, 'g');
        code = code.replace(platformPattern, (match) => {
          // 提取中间的代码
          const lines = match.split('\n');
          return lines.slice(1, -1).join('\n');
        });

        // 移除其他平台的代码
        code = code.replace(/\/\/\s*#ifdef[\s\S]*?\/\/\s*#endif/g, '');

        return {
          code,
          map: null
        };
      }
    }
  };
}
configList.map((config, index) => {
  config.output.sourcemap = false;
  config.plugins = [
    uniAppPreprocessor('H5'),
    ...config.plugins,
    filesize()
  ]

  return config;
})
export default configList;