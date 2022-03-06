import minimist from 'minimist'

export const parseFlags = (argv: string[]): ReturnType<typeof minimist> =>
  minimist(argv, { '--': true })

const checkValue = (
  key: string,
  value: any,
  omitlist: any[],
  picklist: any[],
): boolean =>
  value !== null &&
  value !== undefined &&
  value !== false &&
  value !== 'false' &&
  !omitlist.includes(key) &&
  (picklist.length === 0 || picklist.includes(key))

const formatFlag = (key: string): string =>
  (key.length === 1 ? '-' : '--') + key

export const formatFlags = (
  flags: Record<string, any>,
  ...picklist: string[]
): string[] =>
  Object.keys(flags).reduce<string[]>((memo, key: string) => {
    const omitlist = ['_', '--']
    const value = flags[key]
    const flag = formatFlag(key)

    if (checkValue(key, value, omitlist, picklist)) {
      memo.push(flag)

      if (value !== true) {
        memo.push(value)
      }
    }

    return memo
  }, [])
