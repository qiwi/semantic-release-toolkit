import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from 'fs'
import { isAbsolute,join, normalize } from 'path'

// Deep copy a directory.
export const copyDirectory = (source: string, target: string): void => {
  // Checks.
  if (!isDirectory(source))
    throw new Error('copyDirectory(): source must be an existant directory')
  if (!isDirectory(target)) {
    // Try making it now (Tempy doesn't actually make the dir, just generates the path).
    mkdirSync(target)
    // If it doesn't exist after that there's an issue.
    if (!isDirectory(target))
      throw new Error('copyDirectory(): target must be an existant directory')
  }

  // Copy every file and dir in the dir.
  readdirSync(source).forEach((name) => {
    // Get full paths.
    const sourceFile = join(source, name)
    const targetFile = join(target, name)

    // Directory or file?
    if (isDirectory(sourceFile)) {
      // Possibly make directory.
      if (!existsSync(targetFile)) mkdirSync(targetFile)
      // Recursive copy directory.
      copyDirectory(sourceFile, targetFile)
    } else {
      // Copy file.
      copyFileSync(sourceFile, targetFile)
    }
  })
}

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
export const createNewTestingFiles = (folders: string[], cwd: string): void => {
  folders.forEach((fld) => {
    writeFileSync(`${cwd}/${fld}test.txt`, fld)
  })
}

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
