require('dotenv').config({ path: `.env.${process.env.STAGE || 'dev'}` })
const appConfig = require('../src/config')
const scripts = {
  help: null,
  createIndexes: require('./createIndexes'),
  deleteIndexes: require('./deleteIndexes')
}

async function bin () {
  const config = {
    ...appConfig,
    bin: {
      layout: {
        starRuler: ''.padStart(100, '*'),
        dashRuler: ''.padStart(100, '-'),
        hashRuler: ''.padStart(100, '#')
      }
    }
  }

  try {
    const sliceIndex = process.argv[2]?.trim() === '--' ? 3 : 2
    const args = [...new Set(process.argv.slice(sliceIndex).map(a => a.trim()))]

    const scriptsAsArgs = Object.keys(scripts).map(t => `--${t}`)

    if (!args.length) {
      throw new Error(`At least one of the possible arguments should be informed:\n\n${scriptsAsArgs.join('\n')}`)
    }

    console.log(config.bin.layout.starRuler)
    console.log(`* Executing ${config.app.service}/bin on "${config.app.stage}" stage with args "${args.join(' ')}"`)
    console.log(config.bin.layout.starRuler)
    console.log('')
    const invalidArgs = args.filter((a) => !a.match(/^--.*$/g) || !scriptsAsArgs.includes(a))

    if (invalidArgs.length) {
      throw new Error(`Invalid arguments: ${invalidArgs.join(' ')}`)
    }

    if (args.includes('--help')) {
      if (args.length > 1) {
        throw new Error('--help is not allowed along with other arguments')
      }
      console.log(`Available arguments:\n\n${scriptsAsArgs.join('\n')}`)
      console.log('')
      console.log(config.bin.layout.dashRuler)
      console.log('')
      process.exit(0)
    }

    const threads = args.length ? args : scriptsAsArgs

    for (const thread of threads) await scripts[thread.replace('--', '')]({ config }); console.log('')

    console.log(config.bin.layout.dashRuler)
    console.log('Process completed successfully!')
    console.log(config.bin.layout.dashRuler)
    console.log('')
    process.exit(0)
  } catch (error) {
    console.log('')
    console.log(config.bin.layout.dashRuler)
    console.log('ERROR ON BIN SCRIPTS EXECUTION')
    console.log(config.bin.layout.dashRuler)
    console.error(error.message)
    console.log(config.bin.layout.dashRuler)
    console.log('')
    process.exit(1)
  }
}

bin()
