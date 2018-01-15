import React from 'react'

import https from 'https'
import url from 'url'

import Store from '../../new-tab-store'
import { observer } from 'mobx-react'

import Preloader from '../Preloader'

import NewTabHelper from '../../utils/new-tab'
import NewTabCard from '../NewTabCard'

@observer
export default class NewTab extends React.Component {
  constructor() {
    super()

    this.state = {
      cards: []
    }
  }

  componentDidMount() {
    Store.newTab = this

    this.loadData()
  }

  getCountryCode = async () => {
    return new Promise(
      (resolve, reject) => {
        const req = https.get(url.parse('https://www.freegeoip.net/json/'), (res) => {
          let data = ''

          res.on('data', (d) => {
            data += d
          })

          res.on('end', () => {
            resolve(JSON.parse(data).country_code)
          })
        })

        req.end()
      }
    )
  }

  getNews = (country = 'us') => {
    const newsURL = `https://newsapi.org/v2/top-headlines?country=${country}`

    return new Promise(
      (resolve, reject) => {
        let options = {
          headers: {
            'X-Api-Key': '113af42f31a5472187e0b85ce398994d'
          }
        }

        Object.assign(options, url.parse(newsURL))

        const req = https.get(options, (res) => {
          let data = ''

          res.on('data', (d) => {
            data += d
          })

          res.on('end', () => {
            resolve(JSON.parse(data))
          })
        })

        req.end()
      }
    )
  }
  
  loadPicture = (url) => {
    return new Promise(
      (resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          resolve()
        }

        img.onerror = (e) => {
          reject(e)
        }

        img.src = url
      }
    )
  }

  loadPictures = async (news) => {
    for (var i = 0; i < news.length; i++) {
      await this.loadPicture(news[i].urlToImage)
    }
  }

  async loadData() {
    Store.loading = true

    const countryCode = await this.getCountryCode()
    const data = await this.getNews(countryCode)
    const news = NewTabHelper.getNews(data)

    await this.loadPictures(news)

    Store.news = news
    Store.loading = false
  }

  render() {
    const newsContainer = {
      opacity: Store.loading ? 0 : 1
    }
    
    const preloaderStyle = {
      display: Store.loading ? 'block' : 'none'
    }

    return (
      <div className='new-tab'>
        <div className='new-tab-news' style={newsContainer}>
          {
            Store.news.map((data, key) => {
              return <NewTabCard data={data} key={key} />
            })
          }
        </div>
        <Preloader style={preloaderStyle} />
      </div>
    )
  }
}