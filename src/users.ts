import {Prisma, PrismaClient} from '@prisma/client'
import express from 'express'

var router= express.Router()
var bodyParser = require('body-parser')

const prisma = new PrismaClient()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

function replacer(_key: string, value: any): any {
  // Check if the value is a BigInt
  if (typeof value === 'bigint') {
    // Convert BigInt to string
    return value.toString();
  }
  return value;
}

function reviver(_key: string, value: any): any {
  // Check if the value is a string and represents a BigInt
  if (typeof value === 'string' && /^\d+n$/.test(value)) {
    // Convert string to BigInt
    return BigInt(value.slice(0, -1));
  }
  return value;
}

router.use(express.json())

router.get('/', async (req, res)=> {
  try {
    const query = await prisma.users.findMany({
      include: {
        agency: true,
        caseagency: true
      }
    });
    if(query.length > 0) {
      const json = JSON.stringify(query, replacer);
      const decodedData = JSON.parse(json, reviver);
      res.json(decodedData) 
    } else {
      res.json(false)
    }
  } catch(e) {
      res.json(false)
  }
})

router.get('/:userID', async(req, res) => {
  var params = req.params
  try{
    const query = await prisma.users.findUnique({
      include: {
        agency: true
      },
      where: {
        userID: parseInt(params.userID)
      }
    })
    const json = JSON.stringify(query, replacer)
    const decodedData = JSON.parse(json, reviver)
    res.json(decodedData)
  } catch(e) {
    res.json({result: false})
  }
})

router.post('/login', urlencodedParser, async(req, res) => {
    const {username, password} = req.body
    try{
      let query = Array();
      query = await prisma.$queryRaw`
        SELECT * FROM users Where userName=${username} and userPassword=md5(${password})
      `
      if(query.length > 0) {
        const json = JSON.stringify(query, replacer);
        const decodedData = JSON.parse(json, reviver);
        res.json(decodedData) 
      } else {
        res.json(false)
      }
    } catch(e) {
      res.json(false)
    }
})

router.post('/update', urlencodedParser, async (req, res)=>{
  const {userID, userName, userPassword, userStatus, userType, agencyID} = req.body
  try {
    const query = await prisma.$queryRaw`UPDATE users SET userName=${userName}, userStatus=${userStatus}, userType=${userType}, agencyID=${agencyID} Where userID=${userID}`
    const json = JSON.stringify(query, replacer)
    const decodedData = JSON.parse(json, reviver)
    res.json(decodedData)
  } catch(e) {
    res.send(false)
  }
})

router.get("/:universalURL", (req, res) => { 
  res.send("404 URL NOT FOUND"); 
}); 

module.exports = router
