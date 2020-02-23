const path = require('path').resolve()
const superagent = require('superagent')
const cheerio = require('cheerio')
const html2image = require('node-html-to-image')
let thisNo

exports.newEv = (cb) => {
  setInterval(() => {
    superagent.get('https://www.cdc.go.kr/board/board.es?bid=0015')
      .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3945.130 Safari/537.36')
      .then((res) => {
        const kcdcBBS = cheerio.load(res.text)
        if (!thisNo) thisNo = kcdcBBS('.W8')[2].children[0].data
        else if (thisNo !== kcdcBBS('.W8')[2].children[0].data) {
          thisNo = kcdcBBS('.W8')[2].children[0].data
          const obj = { title: '', url: 'https://www.cdc.go.kr', desc: '' }
          obj.title = kcdcBBS('.ellipsis')[0].children[0].data
          obj.url += kcdcBBS('.ellipsis')[0].parent.attribs.href
          superagent.get(obj.url)
            .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3945.130 Safari/537.36')
            .then((res2) => {
              const kcdcDesc = cheerio.load(res2.text)
              kcdcDesc('p').each((i, e) => {
                if (e.children[0].data) obj.desc += e.children[0].data
              })
              obj.desc = obj.desc.slice(0, 100) + '...'
              if (kcdcDesc('table')) {
                obj.image = path + '/tables/' + thisNo
                html2image({
                  html: cheerio.html(kcdcDesc('table').get(0)),
                  output: path + '/tables/' + thisNo + '.0.png',
                  puppeteerArgs: { defaultViewport: { width: 770, height: 250 }, executablePath: '/usr/bin/chromium-browser' }
                }).then(() => {
                  html2image({
                    html: cheerio.html(kcdcDesc('table').get(1)),
                    output: path + '/tables/' + thisNo + '.1.png',
                    puppeteerArgs: { defaultViewport: { width: 770, height: 250 }, executablePath: '/usr/bin/chromium-browser' }
                  }).then(() => cb(obj))
                })
              } else {
                cb(obj)
              }
            })
        }
      })
  }, 1000)
}
