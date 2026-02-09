const express = require('express')
const app = express()

app.set("view engine", "ejs")

app.use(express.static('static'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const data = []

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/profile/:username', (req, res) => {
  const username = req.params.username
  res.send(`Profielpagina van ${username}`)
})

app.get('/detail', (req, res) => {
  
  res.render("detail", { data: data })
})

app.post('/detail', (req, res) => {
  console.log(req.body)

  data.push({
    title: req.body.title,
    description: req.body.description
  })

  res.redirect('/detail')
})

app.use((req, res) => {
  res.status(404).send('404 Not Found')
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})