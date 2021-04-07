const express = require('express')
const router = express.Router();
require('dotenv').config();
const baseurl = process.env.BASE_URL
const voiceResponse = require('twilio').twiml.VoiceResponse
const {createToken} = require('../utils/token')
const twilioNumber = process.env.TWILIO_PHONE_NUMBER


module.exports = function(app){

// Placing call once twilio device is setup
router.post('/', (req, res) => {
    const io = app.get('io')
    console.log('outgoing call');
    io.emit('outgoingCall', {data: req.body})
    let twiml = new voiceResponse();
    twiml.say('your call es being connected')
    const dial = twiml.dial({callerId: twilioNumber})
    dial.number({
      statusCallbackEvent: 'initiated ringing answered completed',
      statusCallback: `${baseurl}/events/status`,
      statusCallbackMethod: 'POST'}, 
      req.body.number)
    res.type('text/xml');
    res.send(twiml.toString());
})

// creting token for setting up Twilio device

router.post('/token', (req, res) => {
    const accountSid = req.body.accountSid
    const authToken = req.body.authToken
    const appSid = req.body.appSid
    console.log(accountSid, authToken, appSid);
    const token = createToken("outbound", accountSid, authToken, appSid)
    res.set('Content-Type', 'application/jwt');
    res.send(token);
  });

  return router;
}
