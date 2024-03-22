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
        const query = await prisma.complain.findMany({
          include: {
            complaintype: true,
            caseagency: true,
            agency: true,
            complainer: true,
          }
        });
        const json = JSON.stringify(query, replacer);
        const decodedData = JSON.parse(json, reviver);
        res.json(decodedData)
    } catch(e) {
        res.json(e)
    }
})

router.get('/complainer/:complainerID', async (req, res)=> {
  var params = req.params
  try{
    const query = await prisma.complain.findMany({
      include: {
        complaintype: true,
        caseagency: true,
        agency: true,
        complainer: true,
      },
      where: {
        complainerID: parseInt(params.complainerID)
      }
    })
    const json = JSON.stringify(query, replacer)
    const decodedData = JSON.parse(json, reviver)
    res.json(decodedData)
  } catch(e) {
    res.json({result: false})
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
        res.send(false)
    }
});

router.post('/update', urlencodedParser, async (req, res)=> {
  const {complainID, complainTitle, complainDetail, complainDate, complainStatus, schoolID, complainerID, agencyID, complaintypeID, complainImages} = req.body
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
    
    try {
      // const updateData = await prisma.complain.update({
      //   where: {
      //     complainID: complainID
      //   },
      //   data: data
      // });
      const updateData = await prisma.$executeRaw`UPDATE complain Set complainTitle=${complainTitle}, complainDetail=${complainDetail}, complainDate=${complainDate}, complainStatus=${complainStatus}, schoolID=${schoolID}, complainerID=${complainerID}, agencyID=${agencyID}, complaintypeID=${complaintypeID}, complainImages=${complainImages} Where complainID=${complainID}`;
      const json = JSON.stringify(updateData, replacer);
      const decodedData = JSON.parse(json, reviver);
      res.json(decodedData)
    } catch(e) {
      res.send(e)
    }
    
})

router.post('/delete', urlencodedParser, async (req, res)=> {
  const {complainID} = req.body
  try {
    const deleteData = await prisma.complain.delete({
      where: {
        complainID: complainID
      }
    });
    const json = JSON.stringify(deleteData, replacer);
    const decodedData = JSON.parse(json, reviver);
    res.json(decodedData)
  } catch(e) {
    res.send(false);
  }
})

router.get("/:universalURL", (req, res) => { 
  res.send("404 URL NOT FOUND"); 
}); 

module.exports = router
