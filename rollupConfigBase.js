import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import { babel } from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { fileURLToPath } from 'url'
const formatName = "AiyMonitor";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const resolveFile = function (filePath) {
  return path.join(__dirname, filePath)
}
const mitoArr = ["core", "browser", "uniapp"]
const formatArr = ["cjs", "esm", "umd", "iife", "amd"]
const baseRollupArr = []
mitoArr.forEach(item => {
  let name = item.slice(0, 1).toUpperCase() + item.slice(1).toLowerCase()
  let optObj = {
    input: resolveFile(`packages/monitor-${item}/src/index.ts`),
    output: [],
    plugins: [
      resolve(),
      typescript({
        compilerOptions: {
          target: "es5",
          declaration: true, // 生成 .d.ts
          // 把 declarationDir 指向包内的 lib/types
          declarationDir: resolveFile(`packages/monitor-${item}/lib/types`),
          // 关键：将 rootDir 指向包的 src，避免生成时包含 packages/... 前缀
          rootDir: resolveFile(`packages/monitor-${item}/src`),
        }
      }),
      commonjs(),
      babel(),
    ],
  }
  formatArr.forEach(format => {
    optObj.output.push({
      file: resolveFile(`packages/monitor-${item}/lib/bundle.${format}.js`),
      format: format,
      name: formatName + name,
    },)
  })
  baseRollupArr.push(optObj)
})
console.log(JSON.stringify(baseRollupArr))
export default baseRollupArr;