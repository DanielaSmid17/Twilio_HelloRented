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
    console.log('status call changed', date, req.body);
    const io = app.get('io')
    io.emit('callEnding', {data: req.body})
})

router.post('/status', (req, res) => {
    console.log('status call changed post', req.body);
    const io = app.get('io')
    io.emit('callStatus', {data: req.body})
})
