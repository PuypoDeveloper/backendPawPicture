const pasport = require("passport")
const LocaalStrategy = require("passport-local")

pasport.use('local.sigup', new LocaalStrategy ( { 
    usernameField
}))