const express = require('express')
const router = express.Router();
require('dotenv').config();
const baseurl = process.env.BASE_URL
const voiceResponse = require('twilio').twiml.VoiceResponse
const {createToken} = require('../utils/token')

module.exports = function(app){

// Placing call once twilio device is setup
router.post('/', (req, res) => {
    console.log('entro aca', req.body);
    const io = app.get('io')
    io.emit('outgoingCall', {data: req.body.CallSid})
    let twiml = new voiceResponse();
    twiml.dial({
      record: true,
      callerId: process.env.TWILIO_PHONE_NUMBER,
      timeout: 20,
      statusCallback: `${baseurl}/events`,
      statusCallbackEvent: ['answered', 'completed'],
      statusCallbackMethod: 'POST'
    }, req.body.number);
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
