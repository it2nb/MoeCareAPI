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

router.post('/insert', urlencodedParser, async(req, res) => {
    const {complainerPrefixTh, complainerFirstnameTh, complainerLastnameTh, complainerPrefixEn, complainerFirstnameEn, complainerLastnameEn, complainerGender, complainerBirthday, complainerIDcard, complainerPhone, complainerEmail, complainerAddress, provinceID, districtID, subdistrictID, postcode, complainerDefective, complainerPassword, complainerEnable, complainerCreated, createdUserID, complainerUpdated, updatedUserID} = req.body
    try{
        const exec = await prisma.$executeRaw`INSERT Ignore Into complainer(complainerPrefixTh, complainerFirstnameTh, complainerLastnameTh, complainerPrefixEn, complainerFirstnameEn, complainerLastnameEn, complainerGender, complainerBirthday, complainerIDcard, complainerPhone, complainerEmail, complainerAddress, provinceID, districtID, subdistrictID, postcode, complainerDefective, complainerPassword, complainerEnable, complainerCreated, createdUserID, complainerUpdated, updatedUserID) Values (${complainerPrefixTh}, ${complainerFirstnameTh}, ${complainerLastnameTh}, ${complainerPrefixEn}, ${complainerFirstnameEn}, ${complainerLastnameEn}, ${complainerGender}, ${complainerBirthday}, ${complainerIDcard}, ${complainerPhone}, ${complainerEmail}, ${complainerAddress}, ${provinceID}, ${districtID}, ${subdistrictID}, ${postcode}, ${complainerDefective}, md5(${complainerPassword}), ${complainerEnable}, ${complainerCreated}, ${createdUserID}, ${complainerUpdated}, ${updatedUserID})`;
      res.json(exec)
    } catch(e) {
      res.json(false)
    }
})

router.get("/:universalURL", (req, res) => { 
  res.send("404 URL NOT FOUND"); 
}); 

module.exports = router
