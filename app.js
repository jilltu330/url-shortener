const { urlencoded } = require('express')
const express = require('express')
const exphbs = require('express-handlebars')
const random = require('string-random')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost/shorten-url', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', ()=> {
  console.log('mongodb error.')
})
db.once('open', ()=>{
  console.log('mongodb connected.')
})


app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const header = req.headers.origin
  const hash = random(5)
  const result = header+'/'+hash
  res.render('result', { result })
})



app.listen(PORT, () => [
  console.log(`App is running on http://localhost:${3000}`)
])