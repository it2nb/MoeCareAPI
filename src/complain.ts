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
        });
        const json = JSON.stringify(query, replacer);
        const decodedData = JSON.parse(json, reviver);
        res.json(decodedData)
    } catch(e) {
        res.json(e)
    }
})

router.get('/:complainID', async (req, res)=> {
  var params = req.params
  try{
    const query = await prisma.complain.findUnique({
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

router.get('/complainer/:complainerID', async (req, res)=> {
  var params = req.params
  try{
    const query = await prisma.complain.findMany({
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

router.get('/agency/:agencyID', async (req, res)=> {
  var params = req.params
  try{
    const query = await prisma.complain.findMany({
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
        agencyID: parseInt(params.agencyID)
      }
    })
    const json = JSON.stringify(query, replacer)
    const decodedData = JSON.parse(json, reviver)
    res.json(decodedData)
  } catch(e) {
    res.json({result: false})
  }
})

router.get('/complaintype/:complaintypeID', async (req, res)=> {
  var params = req.params
  try{
    const query = await prisma.complain.findMany({
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
        complaintypeID: parseInt(params.complaintypeID)
      }
    })
    const json = JSON.stringify(query, replacer)
    const decodedData = JSON.parse(json, reviver)
    res.json(decodedData)
  } catch(e) {
    res.json({result: false})
  }
})

router.get('/status/:complainStatus', async (req, res)=> {
  var params = req.params
  try{
    var query = null;
    if(params.complainStatus == 'ดำเนินการ') {
      query = await prisma.complain.findMany({
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
          OR: [
            {
              complainStatus: 'รับเรื่อง'
            },
            {
              complainStatus: 'กำลังดำเนินการ'
            },
            {
              complainStatus: 'ส่งต่อหน่วยงาน'
            },
            {
              complainStatus: 'ข้อมูลเพิ่มเติม'
            }
          ]
        }
      })
    } else {
      query = await prisma.complain.findMany({
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
          complainStatus: params.complainStatus
        }
      })
    }
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

router.post('/insert', urlencodedParser, async(req, res) => {
    const {complainTitle, complainDetail, complainDate, complainStatus, schoolID, complainerID, agencyID, complaintypeID, complainImages, complainPdf} = req.body
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
        complainImages: complainImages,
        complainPdf: complainPdf,
    }

    try{
      const insertData = await prisma.$executeRaw`INSERT Ignore Into complain(complainTitle, complainDetail, complainDate, complainStatus, schoolID, complainerID, agencyID, complaintypeID, complainImages, complainPdf) Values (${complainTitle}, ${complainDetail}, ${complainDate}, ${complainStatus}, ${schoolID}, ${complainerID}, ${agencyID}, ${complaintypeID}, ${complainImages}, ${complainPdf})`;
        // const insertData = await prisma.complain.create({data: data});
        const json = JSON.stringify(insertData, replacer);
        const decodedData = JSON.parse(json, reviver);
        res.json(decodedData)
    } catch(e) {
        res.send(false)
    }
});

router.post('/update', urlencodedParser, async (req, res)=> {
  const {complainID, complainTitle, complainDetail, complainDate, complainStatus, schoolID, complainerID, agencyID, complaintypeID, complainImages, complainPdf} = req.body
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
        complainImages: complainImages,
        complainPdf: complainPdf
    }
    
    try {
      // const updateData = await prisma.complain.update({
      //   where: {
      //     complainID: complainID
      //   },
      //   data: data
      // });
      let SqlcomplainDate = new Date(complainDate).toISOString().slice(0, 19).replace('T', ' ')
      const updateData = await prisma.$executeRaw`UPDATE complain Set complainTitle=${complainTitle}, complainDetail=${complainDetail}, complainDate=${SqlcomplainDate}, complainStatus=${complainStatus}, schoolID=${schoolID}, complainerID=${complainerID}, agencyID=${agencyID}, complaintypeID=${complaintypeID}, complainImages=${complainImages}, complainPdf=${complainPdf} Where complainID=${complainID}`;
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

router.get('/count', async (req, res)=>{
  try{
    // const query = await prisma.complain.aggregate({
    //   _count: {
    //     complainID: true
    //   }
    // })
    let query = Array();
    query = await prisma.$queryRaw`SELECT count(complainID) as allQty, sum(if(complainStatus="แจ้งเรื่อง", 1, 0)) as newQty, sum(if(complainStatus="เสร็จสิ้น", 1, 0)) as completeQty From complain`;
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

router.get('/count/agency/:agencyID', async (req, res)=>{
  try{
    // const query = await prisma.complain.aggregate({
    //   _count: {
    //     complainID: true
    //   }
    // })
    let query = Array();
    query = await prisma.$queryRaw`SELECT count(complainID) as allQty, sum(if(complainStatus="แจ้งเรื่อง", 1, 0)) as newQty, sum(if(complainStatus="เสร็จสิ้น", 1, 0)) as completeQty From complain`;
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

router.get("/:universalURL", (req, res) => { 
  res.send("404 URL NOT FOUND"); 
}); 

module.exports = router
