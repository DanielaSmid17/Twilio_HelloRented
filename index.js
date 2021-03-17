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
const recordings = require("./routes/recordings")(app)


// middlewares
app.use(express.json())
app.use(urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000'}))
app.use('/voice/call-in', callIn)
app.use('/voice/call-out', callOut)
app.use('/voice/events', events)
app.use('/voice/recordings', recordings)

const port = process.env.PORT;
const server = app.listen(port, function () {
    console.log(`Express server listening on ${port}`, port, app.get('env'));
  });

const server = app.listen(port || 5000, () => {
    console.log(`Listening on port ${port}`);
})
const io = require('socket.io')(server)
io.on('connection', function(client){
})
app.set("io", io)

