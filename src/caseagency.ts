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
        const query = await prisma.caseagency.findMany({
          include: {
            complain: true,
            agency: true,
            toagency: true,
          }
        });
        const json = JSON.stringify(query, replacer);
        const decodedData = JSON.parse(json, reviver);
        res.json(decodedData)
    } catch(e) {
        res.json(e)
    }
})

router.get('/caseagency/:complainID/:', async (req, res)=> {
  var params = req.params
  try{
    const query = await prisma.caseagency.findMany({
      include: {
        complain: true,
        agency: true,
        toagency: true,
      },
      where: {
        complainID: parseInt(params.complainID)
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
    const {complainID, caseagencyNum, agencyID, caseagencyStatus, caseagnecyDetail, casetoagencyID, caseagnecyDate, caseagencyUpdate} = req.body
    let data: Prisma.caseagencyCreateInput
    data = {
        complain: complainID,
        caseagencyNum: caseagencyNum,
        agency: agencyID,
        caseagencyStatus: caseagencyStatus,
        caseagnecyDetail: caseagnecyDetail,
        toagency: casetoagencyID,
        caseagnecyDate: caseagnecyDate,
        caseagencyUpdate: caseagencyUpdate
    }

    try{
      //const insertData = await prisma.$executeRaw`INSERT Ignore Into complain(complainTitle, complainDetail, complainDate, complainStatus, schoolID, complainerID, agencyID, complaintypeID, complainImages) Values (${complainTitle}, ${complainDetail}, ${complainDate}, ${complainStatus}, ${schoolID}, ${complainerID}, ${agencyID}, ${complaintypeID}, ${complainImages})`;
        const insertData = await prisma.caseagency.create({data: data});
        const json = JSON.stringify(insertData, replacer);
        const decodedData = JSON.parse(json, reviver);
        res.json(decodedData)
    } catch(e) {
        res.send(false)
    }
});

router.post('/update', urlencodedParser, async (req, res)=> {
    const {complainID, caseagencyNum, agencyID, caseagencyStatus, caseagnecyDetail, casetoagencyID, caseagnecyDate, caseagencyUpdate} = req.body
    let data: Prisma.caseagencyCreateInput
    data = {
        complain: complainID,
        caseagencyNum: caseagencyNum,
        agency: agencyID,
        caseagencyStatus: caseagencyStatus,
        caseagnecyDetail: caseagnecyDetail,
        toagency: casetoagencyID,
        caseagnecyDate: caseagnecyDate,
        caseagencyUpdate: caseagencyUpdate
    }
    
    try {
      const updateData = await prisma.caseagency.update({
        where: {
            complainID_caseagencyNum_agencyID: {
                complainID: complainID,
                caseagencyNum: caseagencyNum,
                agencyID: agencyID
            }
        },
        data: data
      });
      const json = JSON.stringify(updateData, replacer);
      const decodedData = JSON.parse(json, reviver);
      res.json(decodedData)
    } catch(e) {
      res.send(false)
    }
    
})

router.post('/delete', urlencodedParser, async (req, res)=> {
  const {complainID, caseagencyNum, agencyID} = req.body
  try {
    const deleteData = await prisma.caseagency.delete({
      where: {
        complainID_caseagencyNum_agencyID: {
            complainID: complainID,
            caseagencyNum: caseagencyNum,
            agencyID: agencyID
        }
      }
    });
    const json = JSON.stringify(deleteData, replacer);
    const decodedData = JSON.parse(json, reviver);
    res.json(decodedData)
  } catch(e) {
    res.send(false);
  }
})

router.post('/delete/complain', urlencodedParser, async (req, res)=> {
    const {complainID, caseagencyNum, agencyID} = req.body
    try {
      const deleteData = await prisma.caseagency.deleteMany({
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
