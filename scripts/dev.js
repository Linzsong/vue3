/**
 * 打包开发环境
 *
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import esbuild from 'esbuild';
import { createRequire } from 'node:module';

/**
 * 解析命令行参数
 */
const {
  values: { format },
  positionals,
} = parseArgs({
  allowPositionals: true,
  options: {
    format: {
      type: 'string',
      short: 'f',
      default: 'esm',
    },
  },
});

// 创建 esm 的 __filename
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(import.meta.url);
// 创建 ems 的 __dirname
const __dirname = dirname(__filename);

const target = positionals.length ? positionals[0] : 'vue';

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`);

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

/**
 * --format cjs or esm
 * cjs ==> reactive.cjs.js
 * esm ==> reactive.esm.js
 */
esbuild
  .context({
    entryPoints: [entry], // 入口文件
    outfile, // 输出文件
    format, // 打包格式 cjs esm file
    platform: format === 'cjs' ? 'node' : 'browser', // 打包平台 node browser
    sourcemap: true, // 开启 sourcemap 方便调试
    bundle: true, // 把所有的依赖打包到一个文件里头
    globalName: pkg.buildOptions.name,
  })
  .then(ctx => ctx.watch());

console.log(entry);
