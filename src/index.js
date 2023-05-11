const { urlencoded } = require("body-parser")
const express = require ( "express")
const morgan  = require ("morgan")
const path = require('path');
const cors = require("cors")



const app = express()


app.set("port", process.env.PORT || 4000)
app.use(morgan("dev"))
app.use(express(urlencoded({extended: false}))) //types of data received
app.use(express.json())


app.use((req, res, next) => { 
    next()
})

app.use(cors({
    origin: '*',
    methods: ['GET']
  }));
  

//Public

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(require("./routers/index"))
app.use(require("./routers/autentications"))

// Route sing up and sing in
app.use("/links",require("./routers/login"))
app.use("/images",require("./routers/images"))




//listen

app.listen(app.get("port"), ()=> { 
    console.log(`listen on port ${app.get("port")}`)
})

