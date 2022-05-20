require('dotenv').config({ path: `.env.${process.env.STAGE || 'dev'}` })
const appConfig = require('../src/config')
const batch = {
  setupDb: require('./setupDb')
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

  const sliceIndex = process.argv[2].trim() === '--' ? 3 : 2
  const args = [...new Set(process.argv.slice(sliceIndex).map(a => a.trim()))]

  console.log(config.bin.layout.starRuler)
  console.log(`* Executing ${config.app.name}/bin on "${config.app.stage}" stage with args "${args.join(' ')}"`)
  console.log(config.bin.layout.starRuler)
  console.log('')

  try {
    const threadList = Object.keys(batch).map(t => `--${t}`)
    const validArgs = [...threadList]
    const invalidArgs = args.filter((a) => !a.match(/^--.*$/g) || !validArgs.includes(a))

    if (invalidArgs.length) throw new Error(`Invalid arguments: ${invalidArgs.join(' ')}`)

    const threads = args.length ? args : threadList

    for (const thread of threads) await batch[thread.replace('--', '')](thread, config); console.log('')

    console.log(config.bin.layout.dashRuler)
    console.log('Process completed successfully!')
  } catch (error) {
    console.log(config.bin.layout.dashRuler)
    console.log('Process completed with errors...')
    console.log('')
    console.error(error.message)
  }
  console.log(config.bin.layout.dashRuler)
  console.log('')
}

bin()
