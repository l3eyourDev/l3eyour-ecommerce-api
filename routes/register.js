var express = require('express');
var router = express.Router();
let bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
router.post('/', async function (req, res, next) {
  const { username, password, pin } = req.body;
  let getInfoUser = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM user WHERE username = '${username}'`,
      function (error, results, fields) {
        if (error) {
          console.error("Error checking username:", error);
          return res.status(500).json({ message: "Failed to check username" });
        }
        resolve(results[0]);
      }
    );
  });
  if (!username || !password || !pin) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }
  let encodePassword = await bcrypt.hashSync(password, 10);
  const stingPin = pin.toString();
  let encodePin = await bcrypt.hashSync(stingPin, 10);
  console.log(encodePin);
  if (getInfoUser) {
    res.status(201).json({ message: "Username already exists" });
  } else {
    const token = await jwt.sign(
      { username: username, role: "user" },
      "uBeGbXXaOmdbGcdPAIxaRIISNnFtiPom",
      { expiresIn: "1h" } 
    );
    connection.query(
      `INSERT INTO user (username, password, pin, point, pointtotal, group_name) VALUES ('${username}', '${encodePassword}', '${encodePin}', 0, 0, 'user')`,
      function (error, results, fields) {
        if (error) {
          console.error("Error registering user:", error);
          return res.status(500).json({ message: "Failed to register user" });
        }
        res.status(200).json({ 
          statusCode: 200,
          message: "User registered successfully",
          data: {
            username: username,
            point: 0,
            role: "user",
            token: token
          }
        });
      }
    );
  }
});

module.exports = router;