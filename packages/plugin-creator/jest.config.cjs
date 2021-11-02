import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const _dirname = dirname(fileURLToPath(import.meta.url))

export default JSON.parse(readFileSync(resolve(_dirname, '../infra/jest.config.json'), { encoding: 'utf8' }))
