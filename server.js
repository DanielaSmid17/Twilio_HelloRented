const cors = require('cors')
const urlencoded = require('body-parser').urlencoded;
const express = require('express')
const app = express()
require('dotenv').config();
const http = require('http')

app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000")})

//require routes
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

const port = process.env.PORT || 8000
const server = http.createServer(app)

const io = require('socket.io')(server)
io.on('connection', (socket)=>{
  socket.emit('clientConnection', null)
  console.log('Client Connected');
})
io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

server.listen(port, () => console.log(`Listening on port ${port}`));
app.set("io", io)

