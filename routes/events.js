const express = require('express')
const router = express.Router();
require('dotenv').config();


module.exports = function(app){
    
    //call ended in the phone
 router.post('/', (req, res) =>{
    const io = app.get('io')
    console.log('call status changed');
    io.emit('callEnding', {data: req.body})
})

router.post('/status', (req, res) => {
    const io = app.get('io')
    io.emit('callStatus', {data: req.body})
})

return router
}