const router = require('express').Router();

router.get('/user/:username', async (req, res) => {
    let username = req.params.username; 
    let db = req.app.locals.databaseClient; 
    
    let user = await db.getUserByUsername(username); 
    res.json(user); 
});

router.post('/user/create/');

module.exports = router; 