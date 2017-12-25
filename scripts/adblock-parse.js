const chalk = require('chalk')
const { AdBlockClient, FilterOptions } = require('ad-block')
const path = require('path')
const fs = require('fs')
const http = require('http')
const https = require('https')
const url = require('url')

const filterListsPath = path.resolve(__dirname, 'filter-lists.json')
const output = path.resolve(__dirname, '../adblock.dat')

const client = new AdBlockClient()

const filterLists = fs.readFileSync(filterListsPath, 'utf8')
const filterListsJson = JSON.parse(filterLists)

let parsedLists = 0
const listsToParse = []

const requestURL = (urlToList, callback) => {
  let request

  const onEnd = (res) => {
    let data = ''
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      callback(data)
    })
  }

  if (urlToList.startsWith('http://')) {
    request = http.request(url.parse(urlToList), onEnd)
  } else if (urlToList.startsWith('https://')) {
    request = https.request(url.parse(urlToList), onEnd)
  } else {
    request = http.request(url.parse(urlToList), onEnd)
  }

  request.on('error', (e) => {
    console.error(e)
  })

  request.end()
}

for (let urlToList in filterListsJson) {
  if (!filterListsJson[urlToList].off) {
    listsToParse.push(Object.assign({url: urlToList}, filterListsJson[urlToList]))
  }
}

for (let i = 0; i < listsToParse.length; i++) {
  console.log(chalk.gray('[INFO] ') + 'Downloading ' + listsToParse[i].title + '...')

  const onListReceive = (list) => {
    parsedLists++

    console.log('')
    console.log(parsedLists + '/' + listsToParse.length)

    console.log(chalk.green('[SUCCESS] ') + 'Downloaded ' + listsToParse[i].title)
    console.log(chalk.gray('[INFO] ') + 'Parsing ' + listsToParse[i].title + '...')

    list.split('\n').forEach(line => client.parse(line))

    console.log(chalk.green('[SUCCESS] ') + 'Parsed ' + listsToParse[i].title)
    
    const buffer = client.serialize(64)
    
    console.log(chalk.gray('[INFO] ') + 'Saving to adblock.dat...')
    fs.writeFileSync(output, buffer)
    console.log(chalk.green('[SUCCESS] ') + 'Saved to adblock.dat')
  }

  requestURL(listsToParse[i].url, onListReceive)
}
