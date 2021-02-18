const express = require('express')
const router = express.Router();
const voiceResponse = require('twilio').twiml.VoiceResponse
// const app = express()
// console.log(app.get('io'));
// const server = require('http').createServer(app)
// const io = require('socket.io')(server)
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
// console.log('server', server.server);

// io.on('connection', function(client){
//     console.log('client connected on host:', client.handshake.headers.host);
// })
// server.listen(3000)

require('dotenv').config();


// module.exports = router;
module.exports = function(app){
    
    router.post('/', (req, res) => {
        console.log(req.body);
        console.log('call in');

       const io = app.get('io')
    //    console.log(io);
        io.emit('callComing', {data: req})
        // console.log(io);
        const twiml = new voiceResponse();
        twiml.say({ voice: 'woman', loop:100 }, 'Hello from your pals at Hello Rented. Thank you for calling')
        res.type('text/xml');
        res.send(twiml.toString())
        
    });
    
    // const ClientCapability = require('twilio').jwt.clientCapability
    // router.get('/token', (req, res) =>{
    //     const capability = new ClientCapability({
    //         accountSid,
    //         authToken 
    //     })
    //     capability.addScope(new ClientCapability.IncomingClientScope('joey'));
    //     const token = capability.toJwt();
    //     res.set('Content-Type', 'application/jwt')
    //     res.send(token)
    // })
    
    return router;
}
    
    //https://demo.twilio.com/welcome/voice/