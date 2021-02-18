const cors = require('cors')

const express = require('express')
const app = express()

const callIn = require("./routes/call-in")(app)
const callOut = require("./routes/call-out")

require('dotenv').config();

app.use(cors())
app.use('/voice/call-in', callIn)
app.use('/voice/call-out', callOut)

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
const io = require('socket.io')(server)
io.on('connection', function(client){
    console.log('client connected on host:', client.handshake.headers.host);
})
// app.set("io", io)


// exports.server = server