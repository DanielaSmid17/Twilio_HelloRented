const express = require('express')
const router = express.Router();
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const baseurl = process.env.BASE_URL
const client = require('twilio')(accountSid, authToken)

const voiceResponse = require('twilio').twiml.VoiceResponse

module.exports = function(app){

//call ended in the phone
router.post('/', (req, res) =>{
    const date = new Date()
    console.log(date, req.body);
    const io = app.get('io')
    io.emit('callEnding', {data: req.body, date})
})

router.post('/callNotAnswered', (req, res) =>{
    const date = new Date()
    console.log(`call not answered ${date}`, req.body );
    client.calls(req.body.id)
    .update({
        url: `${baseurl}/events/routeUnansweredCall`,
    }, function(err, call){
        console.log("error", err);
        console.log('call', call);
    })
 
})
router.post('/routeUnansweredCall', (req, res) => {
    console.log('entro a route unanswered Call');
    const twiml = new voiceResponse()
    twiml.say({ voice: 'alice'}, 'Sorry, it seems we cannot take your call right now')
    res.type('text/xml');
    res.send(twiml.toString()) 
})

return router
}