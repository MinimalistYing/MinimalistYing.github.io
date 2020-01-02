const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')

const app = express()

app.use(express.static('./dist'))

http.createServer(app).listen(80)

https.createServer({
  key: fs.readFileSync('./3294475_minimalistying.com_other/3294475_minimalistying.com.key'),
  cert: fs.readFileSync('./3294475_minimalistying.com_other/3294475_minimalistying.com.pem')
}, app).listen(443)