'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 地址后续项目做完改为9110
  BASE_API: '"http://localhost:8110"'
})
