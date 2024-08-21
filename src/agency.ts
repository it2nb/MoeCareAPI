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
      const query = await prisma.agency.findMany({
        include: {
          complain: true
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

router.post('/insert', urlencodedParser, async(req, res) => {
  const {agencyName, agencyCode} = req.body

  try{
      const exec = await prisma.$executeRaw`INSERT Ignore Into agency(agencyName, agencyCode) Values (${agencyName}, ${agencyCode})`;
    res.json(exec)
  } catch(e) {
    res.json(false)
  }
});

router.post('/update', urlencodedParser, async(req, res) => {
  const {agencyID, agencyName, agencyCode} = req.body

  try{
    const insertData = await prisma.$executeRaw`UPDATE agency Set agencyName=${agencyName}, agencyCode=${agencyCode} Where agencyID=${agencyID}`;
      const json = JSON.stringify(insertData, replacer);
      const decodedData = JSON.parse(json, reviver);
      res.json(decodedData)
  } catch(e) {
      res.send(false)
  }
});

router.post('/delete', urlencodedParser, async(req, res) => {
  const {agencyID} = req.body

  try{
    const insertData = await prisma.$executeRaw`DELETE From agency Where agencyID=${agencyID}`;
      const json = JSON.stringify(insertData, replacer);
      const decodedData = JSON.parse(json, reviver);
      res.json(decodedData)
  } catch(e) {
      res.send(false)
  }
});

router.get("/:universalURL", (req, res) => { 
  res.send("404 URL NOT FOUND"); 
}); 

module.exports = router
