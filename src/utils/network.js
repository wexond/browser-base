import Store from '../store'
import { request as httpsRequest } from 'https' 

export default class Network {
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
        const domain = Network.getDomain(url)

        let certificateExists = false

        for (var i = 0; i < Store.certificates.length; i++) {
          if (Store.certificates[i].domain === domain) {
            let certificate = Store.certificates[i].certificate
            if (certificate.subject == null) return

            const data = {
              type: 'Secure',
              title: certificate.subject.O,
              country: certificate.subject.C
            }

            resolve(data)

            certificateExists = true
          }
        }

        if (certificateExists) return

        let options = {
          host: domain,
          port: 443,
          method: 'GET'
        }

        let req = httpsRequest(options, (res) => {
          let certificate = res.connection.getPeerCertificate()
          if (certificate.subject == null) return

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

        req.on('error', (e) => {
          const data = {
            type: url.startsWith('wexond') ? 'Wexond' : 'Normal'
          }
          resolve(data)
        })

        req.end()
      }
    )
  }
}
