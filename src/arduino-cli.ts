import yargs from 'yargs'
import prompts from 'prompts'
import { SerialPort } from 'serialport'

async function main () {
  const args = await yargs
    .option('path', {
      type: 'string',
    })
    .option('baud', {
      type: 'number',
      default: 9600
    })
    .argv
  
  if (!args.path) {
    console.error('path is required.')
    process.exit(0)
  }

  const serial = new SerialPort({
    path: args.path, baudRate: args.baud })

  while (true) {
    const { code } = await prompts({
      name: 'code',
      message: 'JS:',
      type: 'text'
    })

    if (!code) continue

    const val = eval(code)
    await new Promise<void>((resolve, reject) => {
      serial.write(val, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})