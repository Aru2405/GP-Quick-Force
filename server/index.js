const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

let nextId = 4
let cars = [
  { id: 1, make: 'Toyota', model: 'Corolla', year: 2020, pricePerDay: 35.5 },
  { id: 2, make: 'Ford', model: 'Focus', year: 2019, pricePerDay: 30.0 },
  { id: 3, make: 'Seat', model: 'Ibiza', year: 2021, pricePerDay: 32.0 }
]

app.get('/api/cars', (req, res) => {
  res.json(cars)
})

app.delete('/api/cars/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = cars.findIndex(c => c.id === id)
  if (idx === -1) return res.status(404).json({ message: 'No encontrado' })
  cars.splice(idx, 1)
  res.status(204).send()
})

app.post('/api/cars', (req, res) => {
  const { make, model, year, pricePerDay } = req.body
  const newCar = { id: nextId++, make, model, year, pricePerDay }
  cars.push(newCar)
  res.status(201).json(newCar)
})

app.put('/api/cars/:id', (req, res) => {
  const id = Number(req.params.id)
  const idx = cars.findIndex(c => c.id === id)
  if (idx === -1) return res.status(404).json({ message: 'No encontrado' })
  const { make, model, year, pricePerDay } = req.body
  const updated = Object.assign({}, cars[idx], { make, model, year, pricePerDay })
  cars[idx] = updated
  res.json(updated)
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Mock API listening on http://localhost:${port}`))
