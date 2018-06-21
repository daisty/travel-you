'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 本地
  HOTEL_API: '"http://127.0.0.1:8086"',
  // SAAS_API: '"http://192.168.88.88:28887"',
  SAAS_API: '"http://127.0.0.1:8087"',
  // 测试环境
  // HOTEL_API: '"http://192.168.88.88:28886"',
  BASE_LOGIN_API: '"http://192.168.88.88:9110"'
})
