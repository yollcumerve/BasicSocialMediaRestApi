const Router = require('express').Router()
const authS = require('../service/authS')

// REGİSTER 
Router.post('/register', authS.register )

// LOGIN 
Router.post('/login', authS.login)


module.exports = Router