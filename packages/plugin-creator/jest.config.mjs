import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dirname = dirname(fileURLToPath(import.meta.url))

export default JSON.parse(readFileSync(resolve(_dirname, '../infra/jest.config.json'), { encoding: 'utf8' }))
