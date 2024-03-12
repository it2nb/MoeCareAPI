import {Prisma, PrismaClient} from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
prisma.$connect()
const app = express()
app.use(express.json())

const users = require('./users.ts')
app.use('/users', users)

const agency = require('./agency.ts')
app.use('/agency', agency)

const complaintype = require('./complaintype.ts')
app.use('/complaintype', complaintype)

const complain = require('./complain.ts')
app.use('/complain', complain)

const complainer = require('./complainer.ts')
app.use('/complainer', complainer)

const province = require('./province.ts')
app.use('/province', province)

const district = require('./district.ts')
app.use('/district', district)

const subdistrict = require('./subdistrict.ts')
app.use('/subdistrict', subdistrict)

app.get("/:universalURL", (req, res) => { 
  res.send("404 URL NOT FOUND"); 
}); 

const server = app.listen(3000, () =>
  console.log(`
🚀 Prisma API at: http://localhost:3000`),
)
