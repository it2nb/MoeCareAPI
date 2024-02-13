import {Prisma, PrismaClient} from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
prisma.$connect()
const app = express()
app.use(express.json())

const users = require('./users.ts')
app.use('/users', users)

app.get("/:universalURL", (req, res) => { 
  res.send("404 URL NOT FOUND"); 
}); 

const server = app.listen(3000, () =>
  console.log(`
🚀 Prisma API at: http://localhost:3000`),
)
