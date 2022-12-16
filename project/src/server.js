const app = require('express')()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet  = require('helmet')
const morgan = require('morgan')
const { json, urlencoded } = require("body-parser");
dotenv.config()

app.use(json({ limit: "100kb" }));
app.use(urlencoded({ limit: "100kb", extended: true }));
app.use(helmet())
app.use(morgan("common"))


app.use(require('./routes/_main'))

app.listen(8080, () => {
    console.log('---------------------')
    console.log('Backend Server Is Running')
    console.log('---------------------')
})