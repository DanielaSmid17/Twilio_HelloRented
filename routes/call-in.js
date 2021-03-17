const express = require('express')
const fs = require('fs')
const router = express.Router();
require('dotenv').config();
const voiceResponse = require('twilio').twiml.VoiceResponse
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const baseurl = process.env.BASE_URL
const {createToken} = require('../utils/token')
const client = require('twilio')(accountSid, authToken)


module.exports = function(app){

  router.post('/', (req, res) => {
    console.log(req.body);
    fs.readFile('./settings.json', 'utf8', function (err, data) {
      const twiml = new voiceResponse();
      const settings = JSON.parse(data)
      if (settings.available) callInBrowser(req.body, twiml)
      else transferCall(settings.redirectNumber, twiml)
      res.type('text/xml');
      res.send(twiml.toString()) 
    })

  })
 

  callInBrowser = (data, twiml) => {
    const io = app.get('io')
    io.emit('callComing', {data})
    twiml.say({ voice: 'man', loop: 4}, 'Hello from your pals at Hello Rented. Thank you for calling')
    twiml.record({ transcribe: true, maxLength: 30 })
}
  // server off: forwarding calls to a given number
  transferCall = (number, twiml) => {
      twiml.say({ voice: 'man'}, 'Hello from your pals at Hello Rented. We are re-directing you to one of our agents. Thank you for calling')
      twiml.dial(number)
      // twiml.record({ transcribe: true })

}
  
    
 // call answered in the browser, being redirected to a given number
  router.post('/redirected', (req, res) =>{
    console.log('redirected call', req.body);
    client.calls(req.body.id)
        .update({
          twiml: `<Response><Dial>${req.body.number}</Dial></Response>`, 
        }, function(err, call){
          if (err)
          res.status(404).send('CallSid has expired')
          else
          res.status(200).send('call has been redirected')
          console.log("error", err);
          console.log('call', call);
          })
  })

   
  // creating token for setting device up
  router.get('/token', (req, res) =>{
      const token = createToken("inbound")
      res.set('Content-Type', 'application/jwt');
      res.send(token);
    })
    
    // when click answer button redirecting call
    router.post('/answerCall', (req, res) => {
      client.calls(req.body.id)
      .update({
            record: true,
            url: `${baseurl}/call-in/routeCall`,
            method: 'POST',
            statusCallback: `${baseurl}/events`,
            statusCallbackEvent: ['completed', 'cancelled'],
            statusCallbackMethod: 'POST',
            timeout: 10
          }, function(err, call){
            if (err)
            res.status(404).send('Call expired/not in progress')
            else 
            res.status(200).send('Call answered')
            console.log("error", err);
            console.log('call', call);
          })
      })
      
      // initializing call with client 'joey' (twilio's default)
      router.post('/routeCall', (req, res) => {    
          const twiml = new voiceResponse();
          twiml.dial().client('joey');
          res.type('text/xml')
          res.send(twiml.toString())
        })

      // finalizing call from browser 
      router.post('/hangup', (req, res) =>{
       const twiml = new voiceResponse();
        twiml.hangup();
       res.send(twiml.toString());
       })

       // rejecting call from browser
      router.post('/rejectCall', (req, res) => {
         client.calls(req.body.id)
        .update({
          url: `${baseurl}/call-in/routeRejectCall`,
          method: 'POST'
        }, function(err, call){
          if(err)
          res.status(404).send('Call expired/not in progress')
          else 
          res.status(200).send('Call rejected')
          console.log("error", err);
          console.log('call', call);
          })
       })
      
      // redirecting rejected call for playing voice message
      router.post('/routeRejectCall', (req, res) =>{
        const twiml = new voiceResponse();
        twiml.say({ voice: 'alice' }, 'Sorry, it seems we cannot take your call right now. Please try to reach us out later.');
        res.send(twiml.toString());
      })
    ;
    
    return router;
}
    
