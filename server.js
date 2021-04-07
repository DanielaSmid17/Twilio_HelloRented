const cors = require('cors')
const urlencoded = require('body-parser').urlencoded;
const express = require('express')
const app = express()
require('dotenv').config();
const http = require('http')
const server = http.createServer(app)

app.use(cors());


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
app.use((req, res) => res.sendFile('/index.html', { root: __dirname }))
 
const port = process.env.PORT || 8000

app.post('/', (req, res) =>{
  console.log('hola');
})

const io = require("socket.io")(server, {
  cors: {
    methods: ["GET", "POST"],
    credentials: false
  }
});
io.on('connection', (socket)=>{
  socket.emit('clientConnection', null)
  console.log('Client Connected');
})
io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

io.on('initialization', (data) =>{
  console.log(data);
})

server.listen(port, () => console.log(`Listening on port ${port}`));
app.set("io", io)

