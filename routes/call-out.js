const express = require('express')
const router = express.Router();
require('dotenv').config();
const baseurl = process.env.BASE_URL
const voiceResponse = require('twilio').twiml.VoiceResponse
const {createToken} = require('../utils/token')
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioNumber = process.env.TWILIO_PHONE_NUMBER
const client = require('twilio')(accountSid, authToken)

module.exports = function(app){

// Placing call once twilio device is setup
router.post('/', (req, res) => {
    const io = app.get('io')
    console.log('outgoing call');
    io.emit('outgoingCall', {data: req.body})
    let twiml = new voiceResponse();
    twiml.say('your call es being connected')
    const dial = twiml.dial({callerId: process.env.TWILIO_PHONE_NUMBER})
    dial.number({
      statusCallbackEvent: 'initiated ringing answered completed',
      statusCallback: `${baseurl}/events/status`,
      statusCallbackMethod: 'POST'}, 
      req.body.number)
    res.type('text/xml');
    res.send(twiml.toString());
})

// creting token for setting up Twilio device

router.get('/token', (req, res) => {
    const token = createToken("outbound")
    res.set('Content-Type', 'application/jwt');
    res.send(token);
  });

  return router;
}
