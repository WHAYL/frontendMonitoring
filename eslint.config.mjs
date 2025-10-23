import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  { files: ["**/*.{js,mjs,cjs,ts}"], ignores: ["**/node_modules/**", "**/lib/**", "**/dist/**"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // "off" 或 0 - 关闭规则
    // "warn" 或 1 - 打开规则作为警告（不影响退出代码）
    // "error" 或 2 - 打开规则作为错误（触发时退出代码为 1）
    rules: {
      // eslint 基础规则（带中文注释）
      "semi": 1, // 无分号就警告
      "no-var": "warn", // 要求使用 let 或 const 而不是 var
      "no-debugger": "off", // 允许在开发阶段使用 debugger
      "no-console": "off", // 允许 console（插件会替代或监控）
      "no-multiple-empty-lines": ["error", { max: 1 }], // 不允许多个空行
      "prefer-const": "error", // 使用 let 后未修改的变量应使用 const
      "no-use-before-define": "error", // 禁止在定义之前使用函数/变量/类
      "no-constant-condition": ["error", { "checkLoops": false }], // 禁止条件中使用常量表达式（循环中允许）
      "no-cond-assign": "warn", // 条件中赋值可能为误用，警告提示
      "no-async-promise-executor": "warn", // 禁止在 new Promise 的 executor 中使用 async
      "prefer-rest-params": "warn", // 优先使用剩余参数而非 arguments
      "no-prototype-builtins": "off", // 允许直接调用 Object.prototype 的方法
      "no-empty": "warn", // 空语句块警告

      // 额外常用规则（带中文注释）
      "eqeqeq": ["error", "always"], // 强制使用 === 和 !==，避免隐式类型转换
      "curly": ["error", "all"], // 强制所有控制语句使用花括号
      "no-eval": "error", // 禁止使用 eval
      "no-implied-eval": "error", // 禁止间接使用 eval（如 setTimeout("code", 0)）
      "no-duplicate-imports": "warn", // 禁止重复 import
      "no-shadow": "warn", // 变量名遮蔽上层作用域变量（警告）
      "no-duplicate-case": "error", // switch 中禁止重复 case
      "no-fallthrough": "error", // switch case 禁止贯穿（fallthrough）
      "no-return-await": "warn", // 不必要的 return await
      "consistent-return": "warn", // 函数返回要一致（要么总返回值，要么不返回）
      "default-case": "warn", // switch 应包含 default 分支
      "no-restricted-syntax": ["warn", "WithStatement"], // 禁止使用 with 语法
      "camelcase": ["warn", { "properties": "always" }], // 变量名使用驼峰风格
      "init-declarations": ["warn", "never"], // 变量声明时不强制初始化
      "no-unneeded-ternary": "warn", // 避免不必要的三元运算符
      "no-useless-escape": "warn", // 不必要的转义字符警告

      // import/order 需要 eslint-plugin-import 支持，可按需要启用（示例注释）
      // "import/order": ["warn", { "groups": [["builtin", "external"], "internal", ["parent", "sibling", "index"]], "alphabetize": { "order": "asc", "caseInsensitive": true } }],

      // typescript-eslint 规则
      "@typescript-eslint/no-explicit-any": "off", // 允许 any（可按需改为 warn 或 error）
      "@typescript-eslint/no-this-alias": "off", // 允许 this 别名（如 const self = this）
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }], // 以 _ 开头的变量忽略未使用警告
      "@typescript-eslint/ban-ts-comment": "warn", // 使用 @ts- 注释给出警告
      "@typescript-eslint/no-unused-expressions": "warn", // 禁止未使用的表达式

      // 风格与可读性
      "max-len": ["warn", { "code": 120 }], // 单行最大长度 120
      "padding-line-between-statements": ["warn", { "blankLine": "always", "prev": "block", "next": "return" }], // 重要语句之间添加空行
      "no-trailing-spaces": "error", // 行尾不允许空格
      "array-bracket-spacing": ["error", "never"], // 数组括号内不允许空格
      "object-curly-spacing": ["error", "always"], // 对象花括号内需要空格
    }
  }
];