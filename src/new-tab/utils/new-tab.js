import http from 'http'
import https from 'https'
import url from 'url'

import LanguageHelper from './language'

export default class NewTabHelper {
  static getWebSiteSource (website, headers, parseToJSON = true) {
    return new Promise(
      (resolve, reject) => {
        let options = {
          headers: headers
        }

        Object.assign(options, url.parse(website))

        const req = (website.startsWith('http') ? http : https).get(options, (res) => {
          let data = ''

          res.on('data', (d) => {
            data += d
          })

          res.on('end', () => {
            if (!parseToJSON) resolve(data)
            else resolve(JSON.parse(data))
          })
        })

        req.end()
      }
    )
  }

  static getCountryCode = async () => {
    const json = await NewTabHelper.getWebSiteSource('https://www.freegeoip.net/json/')
    return json.country_code
  }

  static getNews = (newsCount = 10) => {
    return new Promise(
      async (resolve, reject) => {
        const country = await NewTabHelper.getCountryCode()
        const newsURL = `https://newsapi.org/v2/top-headlines?country=${country}`

        const json = await NewTabHelper.getWebSiteSource(newsURL, {
          'X-Api-Key': '113af42f31a5472187e0b85ce398994d'
        })
    
        const news = []
        for (var i = 0; i < newsCount; i++) {
          if (json.articles[i] != null) {
            const image = json.articles[i].urlToImage

            if (image == null || !image.startsWith('http')) newsCount++
            else news.push(json.articles[i])
          }
        }

        for (var i = 0; i < news.length; i++) {
          news[i].favicon = `https://www.google.com/s2/favicons?domain=${news[i].url}`
          news[i].time = NewTabHelper.getArticleTime(news[i].publishedAt)
        }

        await NewTabHelper.loadPictures(news)
        resolve(news)
      }
    )
  }


  static loadPicture (url) {
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

  static loadPictures = async (news) => {
    for (var i = 0; i < news.length; i++) {
      await NewTabHelper.loadPicture(news[i].favicon)
    }
  }

  static getArticleTime (t) {
    const actualDate = new Date()
    const articleDate = new Date(t)
    const time = new Date(actualDate.getTime() - articleDate.getTime())

    let hours = time.getHours()
    let minutes = time.getMinutes()

    if (minutes >= 30) {
      hours++
      minutes = 0
    }

    const newTab = window.dictionary.pages.newTab

    if (hours < 1) {
      if (minutes > 1) {
        const minutesAgo = LanguageHelper.completeWithEndings(newTab.minutes, minutes)

        return `${minutes} ${newTab.minutes} ${newTab.ago}`
      } else {
        return newTab.now
      }
    } else if (hours === 1) {
      return `${newTab.anHour} ${newTab.ago}`
    } else {
      const hoursAgo = LanguageHelper.completeWithEndings(newTab.hours, hours)

      return `${hours} ${hoursAgo} ${newTab.ago}`
    }
  }
  
  static getWeather = (getWeather) => {
    return new Promise(
      async (resolve, reject) => {
        const country = await NewTabHelper.getCountryCode()
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${country}`

        const jsonWeather = await NewTabHelper.getWebSiteSource(weatherURL, {
          'X-Api-Key': '17a6438b1d63d5b05f7039e7cb52cde7'
      })
    })
  }
}
