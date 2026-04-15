import 'express-async-errors'
import express, { ErrorRequestHandler } from 'express'
import db from './engine/database'
import categoriesRouter from './routes/categories'

const app = express()
db.start()
const port = process.env.PORT || 3000
const accessControlAllowOrigin = process.env.ALLOW_ORIGIN || '*'

app.use(express.json())

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', accessControlAllowOrigin)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    console.log(err)
    res.status(err.statusCode || 500).json(err.message);  
  }
  next() 
}

app.use(errorHandler)

// Rutas
app.use('/api/categories', categoriesRouter)
app.use('/', (req, res) => {res.json("Welcome to api")})

app.listen(port, () => {
  console.log(`Listening backend in http://localhost:${port}`)
})