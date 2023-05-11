const express = require("express")
const config = require("./database")
const {Pool} = require("pg")

const pool = new Pool(config)


//encryption

const herlpers = require("../lib/herlpers")


//funtion add user

const insertUser = async (user,password,name) => { 
    const text = 'INSERT INTO login (usuario, password, name) VALUES ($1, $2, $3)'
    const values = [user,password, name]
    const res = await pool.query(text, values)
}


const router = express.Router()


//path to add user

router.post("/newUser", async (req, res) => { 
    const {username, password, name} = req.body;
    const newData = { 
        username,
        password,
        name
    }
    newData.password = await herlpers.encryptPassword(password)
    const text = `SELECT COUNT (*) FROM login WHERE usuario ='${username}'`
    const rest = await pool.query(text)
    const count = rest.rows[0].count
    if (count < 1) { 
        insertUser(newData.username,newData.password,newData.name)
        res.send([newData.username,newData.name])
    }
    else if (count > 0) { 
        res.send(false)
    }
    else {
        res.status(500).send('Error processing the request')
    }
    
})

//verify user


router.post("/verifyUser", async (req, res) => { 
    const {username, password} = req.body
    const newData = { 
        username,
        password,
    }

    //name user

    const nameUser = `SELECT name FROM login WHERE usuario = '${username}'`
    const queryName = await pool.query(nameUser)

    //check if account exists

    const queryUsername = `SELECT usuario FROM login WHERE usuario = '${username}'`
    const rest = await pool.query(queryUsername)
    const checkUser = rest.rows[0] && rest.rows[0].usuario;
    if (checkUser === username) { 

        //verify password
        const queryPassword = `SELECT password FROM login WHERE usuario = '${username}'`
        const restTwo = await pool.query(queryPassword)
        const checkPassword = restTwo.rows[0].password
        const validPassword = await herlpers.matchPassword(password,checkPassword)
        if(validPassword) { 
            res.send(["correct_password", queryName.rows[0].name, username])
        }
        else if (!validPassword ) { 
            res.json("Incorrect_password")
        }
    }
    else if (checkUser === undefined || checkUser === null) { 
        res.json("nonexistent_account")
    }
})





module.exports = router


