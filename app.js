const express = require('express')
const exphbs = require('express-handlebars')
const { urlencoded } = require('express')
const random = require('string-random')
const ShortenUrl = require('./models/shortenUrl')
require('./config/mongoose')
const app = express()
const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(ignoreFavicon)

//index route
app.get('/', (req, res) => {
  res.render('index')
})

//post url submit
app.post('/', (req, res) => {
  const url = req.body.url
  const host = req.headers.origin
  ShortenUrl.find({ url }).lean()
    .then(urls => {
      if (urls.length > 0) {
        const result = host + '/' + urls[0].hash
        res.render('result', { result })
      } else {
        validateHash(random(5))
          .then(hash => { return ShortenUrl.create({ hash, url }) })
          .then(shortenUrl => {
            const hash = shortenUrl.hash
            const result = host + '/' + hash
            res.render('result', { result })
          }).catch(error => {
            console.log(error)
            res.status(500).send()
          })
      }
    })
})

//redirect short url to original url
app.get('/:hash', (req, res) => {
  const hash = req.params.hash
  return ShortenUrl.findOne({ hash }).lean()
    .then(shortenUrl => res.redirect(shortenUrl.url))
    .catch(error => {
      console.log(error)
      res.status(500).send()
    })
})

app.listen(PORT, () => [
  console.log(`App is running on http://localhost:${3000}`)
])

// hash validation function
const validateHash = function (hash, retry) {
  //若亂數已存在，最多重新生產驗證五次，防止進入無窮迴圈
  retry = retry | 5
  return ShortenUrl.exists({ hash }).then(exist => {
    //若亂數存在，
    if (exist) {
      console.log("duplicated hash:" + hash)
      //驗證大於0次，可重新生產亂數並驗證
      if (retry > 0) {
        hash = random(5)
        return validateHash(hash, retry - 1)
      } else {
        //否則通知亂數生產error
        throw new Error('hash generate error')
      }
    } else {
      //通過驗證，傳回繼續作業
      return hash
    }
  })
}

//prevent GET /favicon.ico
function ignoreFavicon(req, res, next) {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  } else {
    next();
  }
}