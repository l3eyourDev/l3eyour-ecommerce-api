var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/setup", function (req, res, next) {
  const {
    website_name,
    logoUrl,
    backgroundUrl,
    homeBackgroundUrl,
    mainColor,
    secondaryColor,
    contact,
    discordWebhook,
    lineWebhook,
    description,
  } = req.body;
console.log(req.body)
  global.connection.query(
    `UPDATE config SET 
            maincolor = '${mainColor}',
            discord_webhook = '${discordWebhook}',
            Line_notify = '${lineWebhook}',
            Secondary_color = '${secondaryColor}',
            contact = '${contact}',
            website_des = '${description}',
            logourl = '${logoUrl}',
            website_name = '${website_name}',
            backgroud_url1 = '${backgroundUrl}',
            backgroud_url2 = '${homeBackgroundUrl}'
        WHERE 1`,
    function (error, results, fields) {
      if (error) {
        return res.status(500).json({ message: "Failed to update config" });
      }
      res.status(200).json({
        message: "Config updated successfully",
      });
    }
  );
});

router.post("/set", function (req, res, next) {
  global.connection.query(
    `SELECT * FROM config`,
    function (error, results, fields) {
      if (error) {
        return res.status(500).json({ message: "Failed to get categories" });
      }
      res.status(200).json(results[0]);
    }
  );
});

module.exports = router;
