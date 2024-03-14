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
        const query = await prisma.complain.findMany();
        const json = JSON.stringify(query, replacer);
        const decodedData = JSON.parse(json, reviver);
        res.json(decodedData)
    } catch(e) {
        res.json(e)
    }
})

router.post('/insert', urlencodedParser, async(req, res) => {
    const {complainTitle, complainDetail, complainDate, complainStatus, schoolID, complainerID, agencyID, complaintypeID, complainImages} = req.body
    let data: Prisma.complainCreateInput
    data = {
        complainTitle: complainTitle,
        complainDetail: complainDetail,
        complainDate: complainDate,
        complainStatus: complainStatus,
        schoolID: schoolID,
        complainer: complainerID,
        agency: agencyID,
        complaintype: complaintypeID,
        complainImages: complainImages
    }

    try{
      const insertData = await prisma.$executeRaw`INSERT Ignore Into complain(complainTitle, complainDetail, complainDate, complainStatus, schoolID, complainerID, agencyID, complaintypeID, complainImages) Values (${complainTitle}, ${complainDetail}, ${complainDate}, ${complainStatus}, ${schoolID}, ${complainerID}, ${agencyID}, ${complaintypeID}, ${complainImages})`;
        // const insertData = await prisma.complain.create({data: data});
        const json = JSON.stringify(insertData, replacer);
        const decodedData = JSON.parse(json, reviver);
        res.json(decodedData)
    } catch(e) {
        res.json(e)
    }
});

router.get("/:universalURL", (req, res) => { 
  res.send("404 URL NOT FOUND"); 
}); 

module.exports = router
