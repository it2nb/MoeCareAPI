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
        if(query.length > 0) {
          const json = JSON.stringify(query, replacer);
          const decodedData = JSON.parse(json, reviver);
          res.json(decodedData) 
        } else {
          res.json(false)
        }
    } catch(e) {
        res.json(e)
    }
})

router.get('/caseagency/:complainID', async (req, res)=> {
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
    if(query.length > 0) {
      const json = JSON.stringify(query, replacer);
      const decodedData = JSON.parse(json, reviver);
      res.json(decodedData) 
    } else {
      res.json(false)
    }
  } catch(e) {
    res.json({result: false})
  }
})

router.get('/casetoagency/:agencyID', async (req, res)=> {
  var params = req.params
  try{
    const query = await prisma.caseagency.findMany({
      include: {
        complain: {
          include: {
            complaintype: true,
            caseagency: {
              include: {
                toagency: true,
                users: true,
                agency: true,
                complainer: true
              },
              orderBy: {
                caseagencyDate: 'desc'
              }
            },
            agency: true,
            complainer: true,
          }
        },
        agency: true,
        toagency: true,
      },
      where: {
        casetoagencyID: parseInt(params.agencyID)
      },
      distinct: ['complainID'],
    })
    let data = Array();
    query.forEach((result, index) => {
      data.push(result['complain']);
    })
    if(data.length > 0) {
      const json = JSON.stringify(data, replacer);
      const decodedData = JSON.parse(json, reviver);
      res.json(decodedData) 
    } else {
      res.json(false)
    }
  } catch(e) {
    res.json({result: false})
  }
})

router.get('/casetoagency/:agencyID/:caseStatus', async (req, res)=> {
  var params = req.params
  try{
    let query = Array();
    let data = Array();
    if(params.caseStatus == "new") {
      query = await prisma.$queryRaw`
        SELECT * From (
          SELECT max(caseagency.caseagencyUpdate) as newCaseTime, ifnull(max(lastCase.caseagencyUpdate), 0) as lastCaseTime, casetoagencyID, complain.* From caseagency 
          Left Join (
            SELECT caseagencyUpdate, agencyID, complainID From caseagency 
            Where agencyID=${parseInt(params.agencyID)}
          ) as lastCase On caseagency.complainID=lastCase.complainID  and caseagency.casetoagencyID=lastCase.agencyID
          Left Join complain On caseagency.complainID=complain.complainID
          Where casetoagencyID=${parseInt(params.agencyID)} 
          Group By caseagency.complainID ) as tb
        Where newCaseTime>lastCaseTime and complainStatus!="เสร็จสิ้น"
      `;
    } else if(params.caseStatus == "operate") {
      query = await prisma.$queryRaw`
        SELECT * From (
          SELECT max(caseagency.caseagencyUpdate) as newCaseTime, ifnull(max(lastCase.caseagencyUpdate), 0) as lastCaseTime, casetoagencyID, complain.* From caseagency 
          Left Join (
            SELECT caseagencyUpdate, agencyID, complainID, caseagencyStatus From caseagency 
            Where agencyID=${parseInt(params.agencyID)}
          ) as lastCase On caseagency.complainID=lastCase.complainID  and caseagency.casetoagencyID=lastCase.agencyID
          Left Join complain On caseagency.complainID=complain.complainID
          Where casetoagencyID=${parseInt(params.agencyID)}
          Group By caseagency.complainID ) as tb
        Where newCaseTime<lastCaseTime and complainStatus!="เสร็จสิ้น"
      `;
    }  else if(params.caseStatus == "complete") {
      query = await prisma.$queryRaw`
        SELECT * From (
          SELECT max(caseagency.caseagencyUpdate) as newCaseTime, ifnull(max(lastCase.caseagencyUpdate), 0) as lastCaseTime, casetoagencyID, complain.* From caseagency 
          Left Join (
            SELECT caseagencyUpdate, agencyID, complainID, caseagencyStatus From caseagency 
            Where agencyID=${parseInt(params.agencyID)} and caseagencyStatus="รายงานผล"
          ) as lastCase On caseagency.complainID=lastCase.complainID  and caseagency.casetoagencyID=lastCase.agencyID
          Left Join complain On caseagency.complainID=complain.complainID
          Where casetoagencyID=${parseInt(params.agencyID)} 
          Group By caseagency.complainID ) as tb
        Where newCaseTime<lastCaseTime or complainStatus="เสร็จสิ้น"
      `;
    }
    let pmap = query.map(async (complain)=> {
      const cpdata = await prisma.complain.findUnique({
        include: {
          complaintype: true,
          caseagency: {
            include: {
              toagency: true,
              users: true,
              agency: true,
              complainer: true
            },
            orderBy: {
              caseagencyDate: 'desc'
            }
          },
          agency: true,
          complainer: true,
        },
        where: {
          complainID: complain.complainID
        }
      })
      data.push(cpdata);
    })
    await Promise.all(pmap);
    if(data.length > 0) {
      const json = JSON.stringify(data, replacer);
      const decodedData = JSON.parse(json, reviver);
      res.json(decodedData) 
    } else {
      res.json(false)
    }
  } catch(e) {
    res.json({result: false})
  }
})

// router.get('/casetoagency/:agencyID/:caseagencyStatus?', async (req, res)=> {
//   var params = req.params
//   try{
//     const query = await prisma.caseagency.findMany({
//       include: {
//         complain: true,
//         agency: true,
//         toagency: true,
//       },
//       where: {
//         casetoagencyID: parseInt(params.agencyID)
//       }
//     })
//     const json = JSON.stringify(query, replacer)
//     const decodedData = JSON.parse(json, reviver)
//     res.json(decodedData)
//   } catch(e) {
//     res.json({result: false})
//   }
// })

router.get('/countcomplain/casetoagency/:agencyID', async (req, res)=>{
  try{
    // const query = await prisma.complain.aggregate({
    //   _count: {
    //     complainID: true
    //   }
    // })
    var params = req.params
    let query = Array();
    query = await prisma.$queryRaw`SELECT sendcase.allQty as allQty, newcase.newQty as newQty, completecase.completeQty as completeQty From caseagency
    Left Join (
      SELECT count(distinct complainID) as allQty, casetoagencyID From caseagency 
      Where casetoagencyID=${parseInt(params.agencyID)}
    ) as sendcase On caseagency.casetoagencyID=sendcase.casetoagencyID
    Left Join (
      SELECT sum(if(newCase>ifnull(lastCase, 0) and complainStatus!="เสร็จสิ้น", 1, 0)) as newQty, casetoagencyID From (
        SELECT max(caseagency.caseagencyUpdate) as newCase, max(lastCase.caseagencyUpdate) as lastCase, casetoagencyID, caseagency.complainID From caseagency 
        Left Join (
          SELECT caseagencyUpdate, agencyID, complainID From caseagency 
          Where agencyID=${parseInt(params.agencyID)}
        ) as lastCase On caseagency.complainID=lastCase.complainID  and caseagency.casetoagencyID=lastCase.agencyID
      Where casetoagencyID=${parseInt(params.agencyID)} Group By caseagency.complainID) as nCase
      Left Join complain On nCase.complainID=complain.complainID
    ) as newcase On caseagency.casetoagencyID=newcase.casetoagencyID
    Left Join (
      SELECT sum(if(newCase<ifnull(lastCase, 0) or complainStatus="เสร็จสิ้น", 1, 0)) as completeQty, casetoagencyID From (
        SELECT max(caseagency.caseagencyUpdate) as newCase, max(lastCase.caseagencyUpdate) as lastCase, casetoagencyID, caseagency.complainID From caseagency 
        Left Join (
          SELECT caseagencyUpdate, agencyID, complainID From caseagency 
          Where caseagencyStatus="รายงานผล" and agencyID=${parseInt(params.agencyID)}
        ) as lastCase On caseagency.complainID=lastCase.complainID  and caseagency.casetoagencyID=lastCase.agencyID
      Where casetoagencyID=${parseInt(params.agencyID)} Group By caseagency.complainID) as cCase
      Left Join complain On cCase.complainID=complain.complainID
    ) as completecase On caseagency.casetoagencyID=completecase.casetoagencyID
    Where caseagency.casetoagencyID=${parseInt(params.agencyID)}
    Group By caseagency.casetoagencyID`;
    // const json = JSON.stringify(query, replacer);
    // const decodedData = JSON.parse(json, reviver);
    // res.json(decodedData) 
    if(query.length > 0) {
      const json = JSON.stringify(query, replacer);
      const decodedData = JSON.parse(json, reviver);
      res.json(decodedData) 
    } else {
      res.json(false)
    }
  } catch(e) {
    res.send(false)
  }

})


router.post('/insert', urlencodedParser, async(req, res) => {
    const {complainID, complainerID, agencyID, userID, caseagencyStatus, caseagencyDetail, casetoagencyID, caseagencyDate, caseagencyUpdate, caseagencyImages, caseagencyPdf} = req.body
    let data: Prisma.caseagencyCreateInput
    data = {
        complain: complainID,
        complainer: complainerID,
        agency: agencyID,
        users: userID,
        caseagencyStatus: caseagencyStatus,
        caseagnecyDetail: caseagencyDetail,
        toagency: casetoagencyID,
        caseagencyDate: caseagencyDate,
        caseagencyUpdate: caseagencyUpdate,
        caseagencyImages: caseagencyImages,
        caseagencyPdf: caseagencyPdf
    }

    try{
      const insertData = await prisma.$executeRaw`INSERT Ignore Into caseagency(complainID, complainerID, agencyID, userID, caseagencyStatus, caseagnecyDetail, casetoagencyID, caseagencyDate, caseagencyUpdate, caseagencyImages, caseagencyPdf) Values (${complainID}, ${complainerID}, ${agencyID}, ${userID}, ${caseagencyStatus}, ${caseagencyDetail}, ${casetoagencyID}, ${caseagencyDate}, ${caseagencyUpdate}, ${caseagencyImages}, ${caseagencyPdf})`;
      //const insertData = await prisma.caseagency.create({data: data});
      const json = JSON.stringify(insertData, replacer);
      const decodedData = JSON.parse(json, reviver);
      res.json(decodedData)
    } catch(e) {
        res.send(req.body)
    }
});

router.post('/update', urlencodedParser, async (req, res)=> {
    const {complainID, complainerID, agencyID, userID, caseagencyStatus, caseagencyDetail, casetoagencyID, caseagencyDate, caseagencyUpdate, caseagencyImages, caseagencyPdf} = req.body
    let data: Prisma.caseagencyCreateInput
    data = {
        complain: complainID,
        complainer: complainerID,
        agency: agencyID,
        users: userID,
        caseagencyStatus: caseagencyStatus,
        caseagnecyDetail: caseagencyDetail,
        toagency: casetoagencyID,
        caseagencyDate: caseagencyDate,
        caseagencyUpdate: caseagencyUpdate,
        caseagencyImages: caseagencyImages,
        caseagencyPdf: caseagencyPdf
    }
    
    try {
      const updateData = await prisma.caseagency.update({
        where: {
            complainID_caseagencyDate: {
                complainID: complainID,
                caseagencyDate: caseagencyDate
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
  const {complainID, caseagencyDate} = req.body
  try {
    const deleteData = await prisma.caseagency.delete({
      where: {
        complainID_caseagencyDate: {
            complainID: complainID,
            caseagencyDate: caseagencyDate
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
