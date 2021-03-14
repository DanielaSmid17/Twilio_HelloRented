const cors = require('cors')
const urlencoded = require('body-parser').urlencoded;
var bodyParser = require('body-parser');
const express = require('express')
const app = express()
require('dotenv').config();

//require routes

const callIn = require("./routes/call-in")(app)
const callOut = require("./routes/call-out")(app)
const events = require("./routes/events")(app)


// middlewares
app.use(express.json())
app.use(urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000'}))
app.use('/voice/call-in', callIn)
app.use('/voice/call-out', callOut)
app.use('/voice/events', events)

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
const io = require('socket.io')(server)
io.on('connection', function(client){
    // console.log('client connected on host:', client.handshake);
    // console.log('client connected on host:', client.handshake.headers.host);
})
app.set("io", io)


// exports.server = server