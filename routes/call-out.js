const express = require('express')
const router = express.Router();
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)
const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = require('twilio').twiml.VoiceResponse
const {urlencoded} = require('body-parser');

module.exports = function(app){
app.use(express.json())

router.post('/', (req, res) => {

    let voiceResponse = new VoiceResponse();
    voiceResponse.dial({
      callerId: process.env.TWILIO_PHONE_NUMBER,
      statusCallback: 'https://398e680f80df.ngrok.io/voice/events',
      statusCallbackEvent: ['completed'],
      statusCallbackMethod: 'POST'
    }, req.body.number);
    res.type('text/xml');
    res.send(voiceResponse.toString());
})


router.get('/token', (req, res) => {
    const appSid = process.env.TWILIO_APP_SID  
    const capability = new ClientCapability({
      accountSid: accountSid,
      authToken: authToken,
    });
    capability.addScope(
      new ClientCapability.OutgoingClientScope({ applicationSid: appSid })
    );
    const token = capability.toJwt();
  
    res.set('Content-Type', 'application/jwt');
    res.send(token);
  });

  return router;
} 