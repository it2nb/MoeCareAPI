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

router.get('/', (req, res)=> {
    res.send("Hello")
})

router.post('/login', urlencodedParser, async(req, res) => {
  const {username, password} = req.body

  try {
    try{
      const query = await prisma.$queryRaw`
        SELECT * FROM complainer Where (complainerPhone=${username} or complainerEmail=${username}) and complainerPassword=md5(${password})
      `

      const json = JSON.stringify(query, replacer);
      const decodedData = JSON.parse(json, reviver);

      res.json(decodedData)
    } catch(e) {
      res.json(false)
    }
  } catch(e) {
    res.json(false)
  }
});

router.post('/insert', urlencodedParser, async(req, res) => {
    const {complainerPrefixTh, complainerFirstnameTh, complainerLastnameTh, complainerPrefixEn, complainerFirstnameEn, complainerLastnameEn, complainerGender, complainerBirthday, complainerIDcard, complainerPhone, complainerEmail, complainerAddress, provinceID, districtID, subdistrictID, postcode, complainerDefective, complainerPassword, complainerEnable, complainerCreated, createdUserID, complainerUpdated, updatedUserID} = req.body

    try{
        const exec = await prisma.$executeRaw`INSERT Ignore Into complainer(complainerPrefixTh, complainerFirstnameTh, complainerLastnameTh, complainerPrefixEn, complainerFirstnameEn, complainerLastnameEn, complainerGender, complainerBirthday, complainerIDcard, complainerPhone, complainerEmail, complainerAddress, provinceID, districtID, subdistrictID, postcode, complainerDefective, complainerPassword, complainerEnable, complainerCreated, createdUserID, complainerUpdated, updatedUserID) Values (${complainerPrefixTh}, ${complainerFirstnameTh}, ${complainerLastnameTh}, ${complainerPrefixEn}, ${complainerFirstnameEn}, ${complainerLastnameEn}, ${complainerGender}, ${complainerBirthday}, ${complainerIDcard}, ${complainerPhone}, ${complainerEmail}, ${complainerAddress}, ${provinceID}, ${districtID}, ${subdistrictID}, ${postcode}, ${complainerDefective}, md5(${complainerPassword}), ${complainerEnable}, ${complainerCreated}, ${createdUserID}, ${complainerUpdated}, ${updatedUserID})`;
      res.json(exec)
    } catch(e) {
      res.json(false)
    }
});

router.get("/:universalURL", (req, res) => { 
  res.send("404 URL NOT FOUND"); 
}); 

module.exports = router
