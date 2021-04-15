// Dirty hack to check that esm is loaded
// https://github.com/TypeStrong/ts-node/issues/641#issuecomment-478899250
if (require('module')._extensions['.mjs']) {
  require = require('@antongolub/esm')(module, {
    mode: 'all',
    cjs: {
      cache: false,
      esModule: true,
      extensions: true,
      namedExports: true
    },
    force: false,
    cache: false,
    await: false,
    sourceMap: false,
  })
}

module.exports = require('../es5')
