const express = require('express')
const router = express.Router();

module.exports = function(app){
router.post('/', (req, res) =>{
    console.log('entramos events');
    const io = app.get('io')
    io.emit('callEnding', {data: req.body})
})

return router
}