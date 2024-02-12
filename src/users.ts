import {Prisma, PrismaClient} from '@prisma/client'
import express from 'express'

var router= express.Router()
var bodyParser = require('body-parser')

const prisma = new PrismaClient()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(express.json())

router.get('/', (req, res)=> {
    res.send("Hello")
})

router.post('/login', urlencodedParser, async(req, res) => {
    const {username, password} = req.body
    try{
      const query = await prisma.$queryRaw`
        SELECT 
          cast(userID as varchar(10)) as userID,
          userName,
          userStatus,
          cast(agencyID as varchar(10)) as agencyID 
        FROM users Where userName=${username} and userPassword=md5(${password})
      `
      res.json(query)
    } catch(e) {
      res.json(false)
    }
})

router.get("/:universalURL", (req, res) => { 
  res.send("404 URL NOT FOUND"); 
}); 

module.exports = router
