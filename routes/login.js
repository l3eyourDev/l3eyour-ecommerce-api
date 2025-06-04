var express = require("express");
var router = express.Router();
let bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // เพิ่มโค้ดนี้
const { set } = require("../app");
/* GET home page. */
router.post("/", async function (req, res, next) {
  const { username, password } = req.body;
  let getPassword = await new Promise((resolve, reject) => {
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
  if (getPassword) {
    var decodePassword = bcrypt.compareSync(password, getPassword.password);
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    if (decodePassword) {
      // สร้าง Token
      const token = await jwt.sign(
        { username: username, role: getPassword.group_name },
        "uBeGbXXaOmdbGcdPAIxaRIISNnFtiPom",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        statusCode: 200,
        message: "Login successfully",
        data: {
          username: username,
          point: getPassword.point,
          role: getPassword.group_name,
          token: token, // ส่ง Token กลับไปยังผู้ใช้
        },
      });
    } else {
      res.status(201).json({
        statusCode: 201,
        message: "Username or password is incorrect",
      });
    }
  } else {
    res.status(202).json({
      statusCode: 202,
      message: "Username not exists",
    });
  }
});

//changepassword

router.put("/changepassword", async function (req, res, next) {
  const { username, oldpassword, newpassword, pin } = req.body;
  let getPassword = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM user WHERE username = '${username}'`,
      function (error, results, fields) {
        if (error) {
          console.error("Error checking username:", error);
          return res
            .status(500)
            .json({ message: "ไม่สามารถตรวจสอบชื่อผู้ใช้ได้" });
        }
        resolve(results[0]);
      }
    );
  });
  if (getPassword) {
    var decodePassword = bcrypt.compareSync(oldpassword, getPassword.password);
    if (!username || !oldpassword || !newpassword) {
      return res
        .status(200)
        .json({ message: "โปรดระบุข้อมูลที่จำเป็นทั้งหมด" });
    }
    if (decodePassword) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newpassword, salt);
      connection.query(
        `UPDATE user SET password = '${hash}' WHERE username = '${username}'`,
        function (error, results, fields) {
          if (error) {
            console.error("Error edit user:", error);
            return res
              .status(500)
              .json({ message: "ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้" });
          }
          res.status(200).json({
            statusCode: 200,
            message: "เปลี่ยนรหัสผ่านสำเร็จ",
          });
        }
      );
    } else {
      res.status(201).json({ message: "รหัสผ่านเดิมไม่ถูกต้อง" });
    }
  } else {
    res.status(202).json({ message: "ชื่อผู้ใช้ไม่มีอยู่ในระบบ" });
  }
});
//forgetpassword

router.put("/forget", async function (req, res, next) {
  const { username, newpassword, pin } = req.body;
  console.log(req.body);
  if (!username || !newpassword || !pin) {
    return res.status(400).json({ message: "โปรดระบุข้อมูลที่จำเป็นทั้งหมด" });
  }

  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "ชื่อผู้ใช้ไม่มีอยู่ในระบบ" });
    }
    const pinMatch = await bcrypt.compare(pin, user.pin);



    if (!pinMatch) {
      return res.status(401).json({ message: "รหัสผ่านเดิมไม่ถูกต้อง" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newpassword, salt);

    await updateUserPassword(username, hash);

    return res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "มีข้อผิดพลาดบางอย่างเกิดขึ้น" });
  }
});

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM user WHERE username = ?`,
      [username],
      function (error, results, fields) {
        if (error) {
          reject(error);
        }
        resolve(results[0]);
      }
    );
  });
}

function updateUserPassword(username, newPasswordHash) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE user SET password = ? WHERE username = ?`,
      [newPasswordHash, username],
      function (error, results, fields) {
        if (error) {
          reject(error);
        }
        resolve();
      }
    );
  });
}
module.exports = router;
