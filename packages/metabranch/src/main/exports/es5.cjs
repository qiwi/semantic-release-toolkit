require = require('@qiwi/esm')(module, {
  mode: 'all',
  cjs: {
    cache:false,
    esModule:true,
    extensions:true,
    namedExports:true
  },
  force: false,
  cache: false,
  await: false,
  sourceMap: false,
})

module.exports = require('../es5/index.js')
