// import fs from 'fs-extra'
// import path from 'path'
// import tempy from 'tempy'
// import {copyDirectory} from "@qiwi/semrel-testing-suite"

// import {gitCheckout, gitConfigAdd, gitConfigGet, gitExec, gitFindUp, gitInit} from '../../../main/ts'

// const root = path.resolve(__dirname, '../../../../../../')
// const fixtures = path.resolve(__dirname, '../../fixtures')
// import execa from 'execa'

import {gitInit} from '../../../main/ts'

describe('git-utils', () => {
	const spy = jest.fn( (..._args: any[]) => ({stdout: ''})) // eslint-disable-line
	const fakeExeca = async (...args: any[]) => spy(...args)
	fakeExeca.sync = spy

	beforeAll(() => {
		jest.mock('execa', () => fakeExeca)
	})
	afterEach(jest.resetAllMocks)

	const cases: [Function, Record<any, any>, string[]][] = [
		[
			gitInit,
			{b: false},
			[]
		]
	]

	cases.forEach(([fn, ctx, result]) => {
		it(`${fn.name}`, async () => {
			expect(await fn(ctx)).toEqual(result)
			expect(spy).toHaveBeenCalledWith(result)
		})
	})
})
