/**
 * 打包开发环境
 *
 */
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

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
})

// console.log(format, positionals)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(__filename, __dirname);


const target = positionals.length ? positionals[0] : 'vue'

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)

console.log(entry);

