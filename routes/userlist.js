var express = require('express');
const { connect } = require('.');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  connection.query(
    'SELECT id FROM user',
    function (error, results, fields) {
      if (error) {
        console.error("Error checking :", error);
        return res.status(500).json({ message: "Failed to check username" });
      }
      console.log(results);
      res.status(200).json(results);
    }
  );
});
router.post('/userlist', function(req, res, next) {
  connection.query(
    'SELECT id, username, point, pointtotal, group_name, createdAt FROM user',
    function (error, results, fields) {
      if (error) {
        console.error("Error checking :", error);
        return res.status(500).json({ message: "Failed to check username" });
      }
      console.log(results);
      res.status(200).json(results);
    }
  );
});


module.exports = router;
