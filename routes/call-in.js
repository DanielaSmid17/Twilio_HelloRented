const express = require('express')
const router = express.Router();
const ClientCapability = require('twilio').jwt.ClientCapability;
require('dotenv').config();
const voiceResponse = require('twilio').twiml.VoiceResponse
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const baseurl = process.env.BASE_URL

const client = require('twilio')(accountSid, authToken)


// module.exports = router;
module.exports = function(app){
    
  
  // app.use(urlencoded({ extended: false }));
  
  router.post('/', (req, res) => {
    const io = app.get('io')
    io.emit('callComing', {data: req.body})
    const twiml = new voiceResponse();
    twiml.say({ voice: 'man', loop: 4}, 'Hello from your pals at Hello Rented. We are re-directing you to one of our agents. Thank you for calling')
    // twiml.dial('+972528014131')
    res.type('text/xml');
    res.send(twiml.toString()) 
  })

  router.post('/redirected', (req, res) =>{
    console.log('entro aca');
    const twiml = new voiceResponse();
    twiml.dial('+972528014131')
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

    client.calls(req.body.id)
        .update({
          url: `${baseurl}/call-in/routeCall`,
          method: 'POST',
          statusCallback: `${baseurl}/events`,
          statusCallbackEvent: ['completed', 'cancelled'],
          statusCallbackMethod: 'POST',
          timeout: 10
        }, function(err, call){
          console.log("error", err);
          console.log('call', call);
          })
  })

  router.post('/hangup', (req, res) =>{
    const twiml = new voiceResponse();
    twiml.hangup();
    res.send(twiml.toString());
  })

  router.post('/rejectCall', (req, res) => {
    client.calls(req.body.id)
        .update({
          url: `${baseurl}/call-in/routeRejectCall`,
          method: 'POST'
        }, function(err, call){
          console.log("error", err);
          console.log('call', call);
          })
  })
      

  router.post('/routeRejectCall', (req, res) =>{
      const twiml = new voiceResponse();
      twiml.say({ voice: 'alice' }, 'Sorry, it seems we cannot take your call right now. Please try to reach us out later.');
      res.send(twiml.toString());
  })
    ;
    

    
    return router;
}
    
    // https://demo.twilio.com/welcome/voice/
