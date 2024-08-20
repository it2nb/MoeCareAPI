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
        const query = await prisma.complaintype.findMany();
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

router.get('/countcomplain', async (req, res) => {
  try {
    const query = await prisma.$queryRaw`SELECT complaintype.complaintypeID, complaintypeName, ifnull(allQty, 0) as allQty, ifnull(newQty, 0) as newQty, ifnull(completeQty, 0) as completeQty From complaintype 
    Left Join (
      SELECT complaintypeID, count(complainID) as allQty, sum(if(complainStatus="แจ้งเรื่อง", 1, 0)) as newQty, sum(if(complainStatus="เสร็จสิ้น", 1, 0)) as completeQty From complain Group By complaintypeID
    ) as complain On complain.complaintypeID=complaintype.complaintypeID`;
    const json = JSON.stringify(query, replacer);
    const decodedData = JSON.parse(json, reviver);
    res.json(decodedData);
  } catch(e) {
    res.send(false)
  }
})

router.post('/insert', urlencodedParser, async(req, res) => {
  const {complaintypeName} = req.body

  try{
    const insertData = await prisma.$executeRaw`INSERT Ignore Into complaintype(complaintypeName) Values (${complaintypeName})`;
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
