import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tempy from 'tempy'

import { cleanPath, createTestingFiles, isDirectory } from '../../../main/ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtures = resolve(__dirname, '../../fixtures')

describe('cleanPath()', () => {
  it('Relative without CWD', () => {
    expect(cleanPath('aaa')).toBe(`${process.cwd()}/aaa`)
    expect(cleanPath('aaa/')).toBe(`${process.cwd()}/aaa`)
  })
  it('Relative with CWD', () => {
    expect(cleanPath('ccc', '/a/b/')).toBe(`/a/b/ccc`)
    expect(cleanPath('ccc', '/a/b')).toBe(`/a/b/ccc`)
  })
  it('Absolute without CWD', () => {
    expect(cleanPath('/aaa')).toBe(`/aaa`)
    expect(cleanPath('/aaa/')).toBe(`/aaa`)
    expect(cleanPath('/a/b/c')).toBe(`/a/b/c`)
    expect(cleanPath('/a/b/c/')).toBe(`/a/b/c`)
  })
  it('Absolute with CWD', () => {
    expect(cleanPath('/aaa', '/x/y/z')).toBe(`/aaa`)
    expect(cleanPath('/aaa/', '/x/y/z')).toBe(`/aaa`)
    expect(cleanPath('/a/b/c', '/x/y/z')).toBe(`/a/b/c`)
    expect(cleanPath('/a/b/c/', '/x/y/z')).toBe(`/a/b/c`)
  })
})

describe('isDirectory()', () => {
  it('differs dirs from other dst types', () => {
    const cases: [string, boolean][] = [
      [`${fixtures}/basicPackage`, true],
      [`${fixtures}/foofoo`, false],
      [`${fixtures}/basicPackage/package.json`, false],
    ]

    cases.forEach(([value, result]) => expect(isDirectory(value)).toBe(result))
  })
})

describe('createTestingFiles', () => {
  it('populates cwd with specified subfolders with `test.txt`', () => {
    const cwd = tempy.directory()
    const folters = ['foo', 'bar']

    createTestingFiles(cwd, folters)

    expect(
      readFileSync(resolve(cwd, 'foo/test.txt'), { encoding: 'utf-8' }),
    ).toBe('foo')
    expect(
      readFileSync(resolve(cwd, 'bar/test.txt'), { encoding: 'utf-8' }),
    ).toBe('bar')
  })
})
