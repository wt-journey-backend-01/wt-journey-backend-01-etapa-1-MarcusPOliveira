const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/sugestao', (req, res) => {
  const { nome, ingredientes } = req.query
  
  if (!nome || !ingredientes) {
    return res.status(400).send('Dados incompletos!')
  }

  res.send(`
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Sugestão recebida - DevBurger</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <h1>Obrigado pela sugestão!</h1>
      <p>Sua sugestão foi registrada com sucesso.</p>
      <p><strong>Nome do lanche sugerido:</strong> ${nome}</p>
      <p><strong>Ingredientes:</strong> ${ingredientes}</p>
      <a href="/">Voltar ao início</a>
    </body>
  </html>
  `)
})

app.get('/contato', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contato.html'))
})


app.post('/contato', (req, res) => {
  const { nome, email, assunto, mensagem } = req.body
  
  const params = new URLSearchParams({ nome, email, assunto, mensagem }).toString()
  
  res.redirect(303, `/contato-recebido?${params}`)
})

app.get('/contato-recebido', (req, res) => {
  const { nome, email, assunto, mensagem } = req.query
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Contato recebido - DevBurger</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body>
        <h1>Mensagem recebida!</h1>
        <p>Nome: <b>${nome || ''}</b></p>
        <p>E-mail: <b>${email || ''}</b></p>
        <p>Assunto: <b>${assunto || ''}</b></p>
        <p>Mensagem: <b>${mensagem || ''}</b></p>
        <a href="/">Voltar ao início</a>
      </body>
    </html>
  `)
})

app.get('/api/lanches', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'data', 'lanches.json')
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao ler arquivo.' })
    
    res.type('json').send(data)
  })
})

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'))
})

app.listen(PORT, () => {
  console.log(`Servidor da DevBurger rodando em http://localhost:${PORT}`)
})