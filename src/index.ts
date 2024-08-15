import {Prisma, PrismaClient} from '@prisma/client'
import express from 'express'

var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()
prisma.$connect()
const app = express()
const multer = require('multer')
//const sharp = require('sharp')
const fs = require('fs')
//const path = require('path')
app.use('/evidencefiles',express.static('upload/evidences'))
app.use(express.json())

const evidenceUpload = multer({
  //dest: 'uploads/',
  storage: multer.diskStorage({
    destination(req: any, file:any, cb: (arg0: null, arg1: string) => void) {
      var path = "upload/evidences"
      if(!fs.existsSync("upload")){
        fs.mkdirSync("upload")
      }
      if(!fs.existsSync(path))
      fs.mkdirSync(path)
      cb(null, path)
    },
    filename(req: any, file: {
      originalname: any, fieldname: any 
  }, cb: (arg0: null, arg1: string) => void) {
        let str = file.originalname.split(".");
        if(str.length > 1) {
          cb(null, `${str[0]}-${Date.now()}.${str[str.length-1]}`);
        }
    },
  }),
})

app.use((req, res, next)=>{
  const authHeader = req.headers['authorization']
  if (authHeader == null) return res.sendStatus(401) 
  
  jwt.verify(authHeader, process.env.TOKEN_SECRET as String, (err: any, user: any) => {
    if (err) return res.send(false)
console.log('ok')
    next()
  })
})

const users = require('./users.ts')
app.use('/users', users)

const agency = require('./agency.ts')
app.use('/agency', agency)

const complaintype = require('./complaintype.ts')
app.use('/complaintype', complaintype)

const complain = require('./complain.ts')
app.use('/complain', complain)

const caseagency = require('./caseagency.ts')
app.use('/caseagency', caseagency)

const complainer = require('./complainer.ts')
app.use('/complainer', complainer)

const province = require('./province.ts')
app.use('/province', province)

const district = require('./district.ts')
app.use('/district', district)

const subdistrict = require('./subdistrict.ts')
app.use('/subdistrict', subdistrict)

app.get("/:universalURL", (req, res) => { 
  res.send("404 URL NOT FOUND")
}); 

app.post('/upload/evidence', evidenceUpload.single('evidenceFile'), async function(req, res) {
  console.log(req)
  try {
    res.json({
      result: true,
      file: req.file
    })
  } catch(e) {
    res.send(false)
  }
  
})

app.post('/delete/evidence', urlencodedParser, async (req, res)=> {
  const {complainImages} = req.body;
  try {
    fs.unlink('upload/evidences/'+complainImages)
    res.send(true)
  } catch(e) {
    res.send(e)
  }
})

const server = app.listen(3000, () =>
  console.log(`
🚀 Prisma API at: http://localhost:3000`),
)
