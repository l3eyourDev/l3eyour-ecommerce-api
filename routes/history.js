var express = require('express');
var router = express.Router();

router.post('/historytopup', function(req, res, next) {
    global.connection.query("SELECT * FROM history_topup", function (error, results, fields) {
        if (error) {
    return res.status(500).json({ message: "Failed to get categories" });
        }
        res.status(200).json(results);
      
    });
});

router.post('/buy', function(req, res, next) {
    global.connection.query("SELECT * FROM history_buy", function (error, results, fields) {
        if (error) {
    return res.status(500).json({ message: "Failed to get categories" });
        }
        res.status(200).json(results);
      
    });
});


module.exports = router;
