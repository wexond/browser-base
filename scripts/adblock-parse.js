const chalk = require('chalk')
const { AdBlockClient, FilterOptions } = require('ad-block')
const path = require('path')
const fs = require('fs')
const http = require('http')
const https = require('https')
const url = require('url')

const filterListsPath = path.resolve(__dirname, 'filter-lists.json')
const output = path.resolve(__dirname, '../detector.buffer')

const client = new AdBlockClient()

const filterLists = fs.readFileSync(filterListsPath, 'utf8')
const filterListsJson = JSON.parse(filterLists)

let parsedLists = 0
let listsToParse = 0

const requestURL = (urlToList, callback) => {
  let request

  if (urlToList.startsWith('http://')) {
    request = http.request(url.parse(urlToList), callback)
  } else if (urlToList.startsWith('https://')) {
    request = https.request(url.parse(urlToList), callback)
  } else {
    request = http.request(url.parse(urlToList), callback)
  }

  request.on('error', (e) => {
    listsToParse--
  })

  request.end()
}

console.log(chalk.gray('[INFO] ') + 'Getting lists to download and parse...')

for (let urlToList in filterListsJson) {
  listsToParse++
}

console.log(listsToParse)

for (let urlToList in filterListsJson) {
  console.log(chalk.gray('[INFO] ') + 'Downloading ' + filterListsJson[urlToList].title + '...')

  const onListReceive = (list) => {
    console.log(parsedLists + '/' + listsToParse)

    console.log(chalk.green('[SUCCESS] ') + 'Downloaded ' + filterListsJson[urlToList].title)
    console.log(chalk.gray('[INFO] ') + 'Parsing ' + filterListsJson[urlToList].title + '...')

    list.split('\n').forEach(line => client.parse(line))

    console.log(chalk.green('[SUCCESS] ') + 'Parsed ' + filterListsJson[urlToList].title)
    
    parsedLists++

    const buffer = client.serialize(64)
    
    console.log(chalk.gray('[INFO] ') + 'Saving to detector.buffer...')
    console.log('')
    fs.writeFile(output, buffer, (err) => {
      if (err) return console.error(err)
    })
  }

  const onListRequest = (res) => {
    let data = ''
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      onListReceive(data)
    })
  }

  let request

  if (urlToList.startsWith('http://')) {
    request = http.request(url.parse(urlToList), onListRequest)
  } else if (urlToList.startsWith('https://')) {
    request = https.request(url.parse(urlToList), onListRequest)
  } else {
    request = http.request(url.parse(urlToList), onListRequest)
  }

  request.on('error', (e) => {
    
  })

  request.end()
}
