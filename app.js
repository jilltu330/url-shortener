const express = require('express')
const exphbs = require('express-handlebars')
const { urlencoded } = require('express')
const random = require('string-random')
const ShortenUrl = require('./models/shortenUrl')
require('./config/mongoose')
const app = express()
const PORT = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

//index route
app.get('/', (req, res) => {
  res.render('index')
})

//post url submit
app.post('/', (req, res) => {
  const url = req.body.url
  const header = req.headers.origin
  return validateHash(random(5))
  .then(hash => { return ShortenUrl.create({ hash, url })})
  .then(shortenUrl => {
    console.log(shortenUrl)
    const hash = shortenUrl.hash
    const result = header + '/' + hash
    res.render('result', { result })
  }).catch(error => { res.status(500).send() })
})

//redirect short url to original url
app.get('/:hash', (req, res) => {
  const hash = req.params.hash
  return ShortenUrl.findOne({ hash })
    .then(shortenUrl => res.redirect(shortenUrl.url))
    .catch(error => { res.status(500).send() })
})

app.listen(PORT, () => [
  console.log(`App is running on http://localhost:${3000}`)
])

// hash validation function
const validateHash = function (hash) {
  return ShortenUrl.exists({ hash }).then(exist => {
    if (exist) {
      console.log("duplicated hash:" + hash)
      hash = random(5)
      return validateHash(hash)
    } else {
      return hash
    }
  })
}