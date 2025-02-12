const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
  {
    'id': '1',
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'name': 'Ada Lovelace',
    'number': '39-44-5323523',
    'id': '2'
  },
  {
    'name': 'Dan Abramov',
    'number': '12-43-234345',
    'id': '3'
  },
  {
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122',
    'id': '4'
  }
]

const generateId = () => Math.floor(Math.random() * 1000).toString()

//Middlewares
app.use(cors())
app.use(express.json())

morgan.token('body', (request) =>  request.method === 'POST' ? JSON.stringify(request.body) : null)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

//Endpoints
app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (!person) {
    return response.status(404).end()
  }
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const id = generateId()
  const { name, number } = request.body
  if (!name || !number || name === '' || number === '') {
    return response
      .status(400)
      .json({ error: 'Name or number missing' })
  }
  if (persons.some(person => person.name === name)) {
    return response
      .status(409)
      .json({ error: 'Name must be unique' })
  }
  const person = { ...request.body, id }
  persons.push(person)
  response.status(201).json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
