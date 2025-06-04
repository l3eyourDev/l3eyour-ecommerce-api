var express = require('express');
const { connect } = require('.');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  const username = req.body.username;
  connection.query(
    `SELECT id, username, point, pointtotal, group_name, createdAt FROM user WHERE username = '${username}'`,
    function (error, results, fields) {
      if (error) {
        console.error("Error checking username:", error);
        return res.status(500).json({ message: "Failed to check username" });
      }
      res.status(200).json(results[0]);
    }
  );
});

//แก้ไขข้อมูลที่ไม่ใช่ username กับ password
router.put('/edit', function(req, res, next) {
  const username = req.body.username;
  const point = req.body.point;
  const pointtotal = req.body.pointtotal;
  const group_name = req.body.group_name;

  connection.query(
    `UPDATE user SET point = '${point}', pointtotal = '${pointtotal}', group_name = '${group_name}' WHERE username = '${username}'`,
    function (error, results, fields) {
      if (error) {
        console.error("Error edit user:", error);
        return res.status(500).json({ message: "Failed to edit user" });
      }
      res.status(200).json({ message: "Edit user success" });
    }
  );
});

//changepassword



module.exports = router;
