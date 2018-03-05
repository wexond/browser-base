import Store from '../store'
import { request as httpsRequest } from 'https' 
import http from 'http'
import urlNode from 'url'

export default class Network {
  static async requestURL (url) {
    return new Promise((resolve, reject) => {
      const options = urlNode.parse(url)
      const request = http.request(options, (res) => {
        let data = ''
        res.setEncoding('utf-8')
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          resolve(data)
        })
      })
  
      request.on('error', (e) => {
        reject(e)
      })
      request.end()
    })
  }

  static isURL (string) {
    const _isURL = (string) => {
      let pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/
      return pattern.test(string)
    }

    if (_isURL(string)) {
      return true
    } else {
      return _isURL('http://' + string)
    }
  }

  static getDomain (url) {
    let hostname = url

    if (hostname.indexOf('http://') !== -1 || hostname.indexOf('https://') !== -1) {
      hostname = hostname.split('://')[1]
    }

    if (hostname.indexOf('?') !== -1) {
      hostname = hostname.split('?')[0]
    }

    if (hostname.indexOf('://') !== -1) {
      hostname = hostname.split('://')[0] + '://' + hostname.split('/')[2]
    } else {
      hostname = hostname.split('/')[0]
    }

    return hostname
  }

  static getCertificate (url) {
    return new Promise(
      (resolve, reject) => {
        if (url.startsWith('http://')) { return resolve({type: 'Normal'}) }
        else if (url.startsWith('wexond://')) { return resolve({type: 'Wexond'}) }

        const domain = Network.getDomain(url)

        let certificateExists = false

        for (var i = 0; i < Store.certificates.length; i++) {
          if (Store.certificates[i].domain === domain) {
            let certificate = Store.certificates[i].certificate
            if (certificate.subject == null) { return }

            const data = {
              type: 'Secure',
              title: certificate.subject.O,
              country: certificate.subject.C
            }

            resolve(data)

            certificateExists = true
          }
        }

        if (certificateExists) { return }

        let options = {
          host: domain,
          port: 443,
          method: 'GET'
        }

        let req = httpsRequest(options, (res) => {
          let certificate = res.connection.getPeerCertificate()
          if (certificate.subject == null) { return }

          const data = {
            type: 'Secure',
            title: certificate.subject.O,
            country: certificate.subject.C
          }
          resolve(data)

          Store.certificates.push({
            domain: domain,
            certificate: certificate
          })
        })

        req.end()
      }
    )
  }
}
