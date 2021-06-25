const express = require('express')
const app = express()
const PORT = 3000

app.get('/', (req,res)=>{
  res.send('tiny url project')
})

app.listen(PORT, ()=>[
  console.log(`App is running on http://localhosr:${3000}`)
])