import execa from 'execa'

import {
	gitInit,
	gitCheckout,
	gitConfigAdd,
} from '../../../main/ts'
import tempy from "tempy";

jest.mock('execa')

describe('git-utils', () => {
	const fakeExec = (..._args: any[]) => ({stdout: 'output'})  // eslint-disable-line
	const execaAsync = jest.fn(fakeExec)
	const execaSync = jest.fn(fakeExec)

	beforeAll(() => {
		// @ts-ignore
		execa.mockImplementation(async (...args: any[]) => execaAsync(...args))

		// @ts-ignore
		execa.sync.mockImplementation(execaSync)
	})

	afterAll(jest.clearAllMocks)

	const cwd = tempy.directory()
	const cases: [Function, Record<any, any>, any[], any?][] = [
		[
			gitInit,
			{cwd},
			['git', ['init'], {cwd}],
			cwd
		],
		[
			gitCheckout,
			{cwd, b: true, branch: 'foobar'},
			['git', ['checkout', '-b', 'foobar'], {cwd}],
			'output'
		],
		[
			gitConfigAdd,
			{cwd, key: 'user.name', value: 'Foo Bar'},
			['git', ['config', '--add', 'user.name', 'Foo Bar'], {cwd}],
			'output'
		]
	]

	cases.forEach(([fn, ctx, args, result]) => {
		it(`${fn.name}`, async () => {
			await fn(ctx)
			expect(fn({...ctx, sync: true})).toBe(result)

			expect(execaAsync).toHaveBeenCalledWith(...args)
			expect(execaSync).toHaveBeenCalledWith(...args)
		})
	})
})
