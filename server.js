const cors = require('cors')
const urlencoded = require('body-parser').urlencoded;
const express = require('express')
const app = express()
require('dotenv').config();

//require routes
app.use(cors({origin:['http://localhost:8000', 'https://hr-twilio-fe.herokuapp.com/']}))

const callIn = require("./routes/call-in")(app)
const callOut = require("./routes/call-out")(app)
const events = require("./routes/events")(app)



// middlewares
app.use(express.static(__dirname))
app.use(express.json())
app.use(urlencoded({ extended: false }));
app.use('/voice/call-in', callIn)
app.use('/voice/call-out', callOut)
app.use('/voice/events', events)

const port = process.env.PORT;
const server = app.listen(port, function () {
    console.log(`Express server listening on ${port}`, port, app.get('env'));
  });

const io = require('socket.io')(server)
io.on('connection', function(client){
  console.log('socket connected');
})
io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
app.set("io", io)

