const express = require("express")
const config = require("./database")
const {Pool} = require("pg")
const cors = require("cors")
const imageDownloader = require('./image-downloader').download
const uuid = require("uuid")

const router = express.Router()
const pool = new Pool(config)

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  }
  router.use(cors(corsOptions));

//INSERT URL 

const insertURL = async (prompt,url,id) => { 
    const uniqueIdImage = uuid.v4()
    const timestamp = Date.now()
    const filename = './images/'.concat(`${uniqueIdImage}${timestamp}.jpg`);
    imageDownloader(url, filename, function(){});
    const queryInsert = `INSERT INTO images (description, url, user_id) VALUES ($1, $2, $3)`
    const values = [prompt,filename,id]
    const res = await pool.query(queryInsert,values)
}


//SAVE PROPMT AND URL


router.post("/URL", async (req, res) => { 
    const {prompt, url, userId} = req.body
    const newDate = { 
        prompt,
        url,
        userId
    }
    const queryId  = `SELECT id FROM login WHERE usuario = '${userId}'`
    const id = await pool.query(queryId)
    const idTwo = id.rows[0].id
    insertURL(prompt,url,idTwo)
    res.send(true)
})

module.exports = router


//SEND INFO

router.post("/SEND", async (req, res) => { 
    const {prompt, url, userId} = req.body
    const newDate = { 
        prompt,
        url,
        userId
    }
    const queryId  = `SELECT id FROM login WHERE usuario = '${userId}'`
    const id = await pool.query(queryId)
    const newId = id.rows[0].id
    const imagesSend = `SELECT url FROM images WHERE user_id = ${newId}`
    const resImagesSend = await pool.query(imagesSend)
    const urlImage = resImagesSend.rows
    console.log(urlImage)
    res.send(urlImage)
    
})