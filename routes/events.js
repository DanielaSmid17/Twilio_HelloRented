const express = require('express')
const router = express.Router();
require('dotenv').config();


module.exports = function(app){
    const io = app.get('io')

//call ended in the phone
router.post('/', (req, res) =>{
    io.emit('callEnding', {data: req.body})
})

router.post('/status', (req, res) => {
    io.emit('callStatus', {data: req.body})
})

return router
}