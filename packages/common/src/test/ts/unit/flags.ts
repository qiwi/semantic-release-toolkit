import { formatFlags, parseFlags } from '../../../main/ts/flags'

describe('formatFlags()', () => {
  it('return proper values', () => {
    const cases: [Record<string, any>, string[], string[]][] = [
      [{ _: [], '--': [] }, [], []],
      [{ foo: 'bar' }, [], ['--foo', 'bar']],
      [{ a: true, b: 'true', c: false, d: 'false' }, [], ['-a', '-b', 'true']],
      [{ verbose: true }, [], ['--verbose']],
      [
        { f: true, foo: 'bar', b: true, baz: 'qux' },
        ['f', 'baz'],
        ['-f', '--baz', 'qux'],
      ],
      [
        parseFlags([
          '-w',
          '1',
          '--force',
          '--audit-level=moderate',
          '--only=dev',
          '-c',
          'ccc',
          '--',
          '--bar',
          '-b',
          '2',
        ]),
        ['force', 'audit-level', 'only', 'bar', 'b', 'c'],
        ['--force', '--audit-level', 'moderate', '--only', 'dev', '-c', 'ccc'],
      ],
    ]

    cases.forEach(([input, picklist, output]) => {
      expect(formatFlags(input, ...picklist)).toEqual(output)
    })
  })
})
