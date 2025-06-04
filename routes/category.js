var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {

  global.connection.query(
    "SELECT * FROM category",
    function (error, results, fields) {
      if (error) {
        return res.status(500).json({ message: "Failed to get categories" });
      }
      res.status(200).json(results);
    }
  );
});


router.post("/seach", function (req, res, next) {
  console.log(req.body);
  const category_name = req.body.category_name;
  connection.query(
    `SELECT * FROM category WHERE category_name = '${category_name}'`,
    function (error, results, fields) {
      if (error) {
        console.error("Error checking category_name:", error);
        return res.status(500).json({ message: "Failed to check category_name" });
      }
      res.status(200).json(results[0]);
    }
    );
}
);
router.put("/edit", function (req, res, next) {
    const { id, category_name, category_image, category_show, category_hightlight } = req.body;
    connection.query(
        `UPDATE category 
         SET 
         category_name = '${category_name}',
         category_image = '${category_image}',
         category_show = ${category_show},
         category_hightlight = ${category_hightlight}
         WHERE id = ${id}`,
        function (error, results, fields) {
            if (error) {
                console.error("Error updating category:", error);
                return res.status(500).json({ message: "Failed to update category" });
            }
            res.status(200).json({ message: "Category updated successfully" });
        }
    );
});

router.delete("/delete", function (req, res, next) {
    const category_id = req.body.category_id;
    connection.query(
        `DELETE FROM category WHERE id = '${category_id}'`,
        function (error, results, fields) {
        if (error) {
            console.error("Error delete category:", error);
            return res.status(500).json({ message: "Failed to delete category" });
        }
        res.status(200).json({ message: "Delete category success" });
        }
    );
    }
);
router.post("/add", function (req, res, next) {
    const { category_name, category_image,  category_hightlight } = req.body;
    connection.query(
        `INSERT INTO category (category_name, category_image, category_show, category_hightlight) 
         VALUES ('${category_name}', '${category_image}',1, ${category_hightlight})`,
        function (error, results, fields) {
            if (error) {
                console.error("Error adding category:", error);
                return res.status(500).json({ message: "Failed to add category" });
            }
            res.status(200).json({ message: "Category added successfully" });
        }
    );
});
module.exports = router;
