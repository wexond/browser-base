const { AdBlockClient, FilterOptions } = require('ad-block')
const { app } = require('electron')
const path = require('path')
const fs = require('fs')

const lists = path.resolve(__dirname, './lists')
const output = path.resolve(__dirname, '../detector.buffer')
const client = new AdBlockClient()

fs.readdir(lists, (err, files) => {
  if (err) return console.error(err)

  for (var i in files) {
    console.log('Parsing ' + files[i] + '...')

    const data = fs.readFileSync(path.resolve(lists, files[i]), 'utf8')
    data.split('\n').forEach(line => client.parse(line))

    console.log('Parsed ' + files[i])
  }

  const buffer = client.serialize(64)
    
  fs.writeFile(output, buffer, (err) => {
    if (err) console.log(err)

    console.log('Saved to detector.buffer.')

    process.exit()
  })
})
