const express = require('express')
const router = express.Router();
const ClientCapability = require('twilio').jwt.ClientCapability;

require('dotenv').config();


// module.exports = router;
module.exports = function(app){
  const voiceResponse = require('twilio').twiml.VoiceResponse
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const client = require('twilio')(accountSid, authToken)
    
  
  // app.use(urlencoded({ extended: false }));
  
  router.post('/', (req, res) => {
    const io = app.get('io')
    console.log(req.body.From);
    console.log('call in')
    io.emit('callComing', {data: req.body})
    const twiml = new voiceResponse();
    twiml.say({ voice: 'man', loop:100 }, 'Hello from your pals at Hello Rented. Thank you for calling')
    res.type('text/xml');
    res.send(twiml.toString()) 
  })
    
  router.get('/token', (req, res) =>{
      const capability = new ClientCapability({
        accountSid: accountSid,
        authToken: authToken,
      });
      capability.addScope(new ClientCapability.IncomingClientScope('joey'));
      const token = capability.toJwt();
    
      res.set('Content-Type', 'application/jwt');
      res.send(token);
    })

  router.post('/routeCall', (req, res) => {
      const twiml = new voiceResponse();
      twiml.dial().client('joey');
      res.type('text/xml')
      res.send(twiml.toString())
    })
  
  router.post('/answerCall', (req, res) => {
    console.log('id', req.body.id);
    client.calls(req.body.id)
        .update({
          url: 'https://398e680f80df.ngrok.io/voice/call-in/routeCall',
          method: 'POST',
        }, function(err, call){
          console.log("error", err);
          console.log('call', call);
          })
        })
        
    ;
    

    
    return router;
}
    
    // https://demo.twilio.com/welcome/voice/
