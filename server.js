const express = require('express')
const app = express()
var https = require('https')
var http = require('http')

app.use(express.static('./dist'))

http.createServer(app).listen(80)
https.createServer({}, app).listen(443)