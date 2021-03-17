const express = require('express')
const router = express.Router();
const axios = require('axios')
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

module.exports = function(app){
    router.get('/', async (req, res) =>{
      console.log('entro aca');
      // try {
      //   const recording = await axios.get("http://api.twilio.com/2010-04-01/Accounts/AC3854e27d2e5fa61e3be97fdafa7ed412/Calls/CA1ad432f7743eeb93ca4c8e6f2a65bc7a/Recordings.json", {
      //     headers: {
      //       'Authorization': `${authToken}`
      //     }})
      //   console.log(recording);
      // } catch(err){
      //   console.log('error:', err);
      // }
      let recording;
      const recordingfetched = await client
      .calls('CA1ad432f7743eeb93ca4c8e6f2a65bc7a')
      .fetch()
      .then(call => recording = call);
      console.log(recording);
      console.log(recordingfetched);
      res.send('hola')
    })
    return router
}