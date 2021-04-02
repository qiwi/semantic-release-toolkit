import { plugin } from './plugin'

const {
  verifyConditions,
  analyzeCommits,
  verifyRelease,
  generateNotes,
  prepare,
  publish,
  addChannel,
  success,
  fail,
} = plugin

export {
  verifyConditions,
  analyzeCommits,
  verifyRelease,
  generateNotes,
  prepare,
  publish,
  addChannel,
  success,
  fail,
}

export * from './actions'
export * from './interface'
export * from './plugin'
export * from './options'

export default plugin
