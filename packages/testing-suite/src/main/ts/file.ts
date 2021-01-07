import {
  existsSync,
  lstatSync,
  writeFileSync,
} from 'fs'

import { isAbsolute, join, normalize } from 'path'

import { ensureFileSync } from 'fs-extra'

export { copySync as copyDirectory } from 'fs-extra'

// Is given path a directory?
export const isDirectory = (path: string): boolean => {
  // String path that exists and is a directory.
  return (
    typeof path === 'string' &&
    existsSync(path) &&
    lstatSync(path).isDirectory()
  )
}

// Creates testing files on all specified folders.
export const createTestingFiles = (cwd: string, folders: string[]): void =>
  folders.forEach((fld) => {
    const target = join(cwd, fld, 'test.txt')

    ensureFileSync(target)
    writeFileSync(target, fld)
  })

/**
 * Normalize and make a path absolute, optionally using a custom CWD.
 * Trims any trailing slashes from the path.
 *
 * @param {string} path The path to normalize and make absolute.
 * @param {string} cwd=process.cwd() The CWD to prepend to the path to make it absolute.
 * @returns {string} The absolute and normalized path.
 *
 * @internal
 */
export const cleanPath = (path: string, cwd = process.cwd()): string => {
  // Checks.
  // check(path, "path: path");
  // check(cwd, "cwd: absolute");

  // Normalize, absolutify, and trim trailing slashes from the path.
  return normalize(isAbsolute(path) ? path : join(cwd, path)).replace(/[/\\]+$/, "");
}
