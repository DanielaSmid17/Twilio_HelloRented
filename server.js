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
app.use(cors())
app.use('/voice/call-in', callIn)
app.use('/voice/call-out', callOut)
app.use('/voice/events', events)

const port = process.env.PORT;
const server = app.listen(port, function () {
    console.log(`Express server listening on ${port}`, port, app.get('env'));
  });

const io = require('socket.io')("https://hr-twilio-fe.herokuapp.com/")
io.on('connection', function(client){
})
app.set("io", io)

