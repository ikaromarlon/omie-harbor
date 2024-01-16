const dotenv = require('dotenv')
const fs = require('node:fs')
const { resolve } = require('node:path')

const envFile = resolve(__dirname, '..', '.env.test')

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile })
}

module.exports = async () => {}
