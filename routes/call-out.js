const express = require('express')
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
require('dotenv').config();
const client = require('twilio')(accountSid, authToken)


//Outbound 
router.post('/', (req, res) => {
    client.calls.create({
        url: 'https://b40487ed4c05.ngrok.io/voice/call-in',
        to: process.env.MY_PHONE_NUMBER,
        from: process.env.TWILIO_PHONE_NUMBER
    }, function(err, call){
        if(err) {
            console.log(err);
        } else {
            console.log(call.sid);
        }
    })
})

module.exports = router;