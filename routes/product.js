var express = require("express");
const { connect } = require("./product");
var router = express.Router();

/* GET home page. */
router.post("/", function (req, res, next) {
  global.connection.query(
    "SELECT * FROM product",
    function (error, results, fields) {
      if (error) {
        return res.status(500).json({ message: "Failed to get products" });
      }

      // กรองข้อมูลและคำนวณจำนวนสินค้า
      results.forEach(product => {
        const productList = product.product.split("\n").filter(item => item.trim() !== '');
        const productCount = productList.length;
        product.amount = productCount;
      });

      // กำหนดค่า null ให้กับฟิลด์ "product" ที่มีค่าเป็น "ไก่\nไข่"
      const filteredResults = results.map(product => ({
        ...product,
        product: null
      }));

      // คำนวณจำนวนสินค้าทั้งหมด
      const productAmount = results.reduce((total, product) => product.product !== null ? total + product.amount : total, 0);
      
      res.status(200).json({ products: filteredResults, productAmount });
    }
  );
});



router.post("/", function (req, res, next) {
  const product_name = req.body.product;
  connection.query(
    `SELECT * FROM product WHERE itemname = '${product_name}'`,
    function (error, results, fields) {
      if (error) {
        console.error("Error checking itemname:", error);
        return res.status(500).json({ message: "Failed to check itemname" });
      }
      res.status(200).json(results[0]);
    }
  );
});
router.put("/edit", function (req, res, next) {
  const {
    id,
    itemname,
    price,
    des,
    product,
    product_image,
    category_name,
    product_hightlight,
    product_status,
  } = req.body;
  connection.query(
    `UPDATE product 
     SET 
     itemname = '${itemname}',
     price = ${price},
     des = '${des}',
      product = '${product}',
     product_image = '${product_image}',
    category_name = '${category_name}',
     product_hightlight = ${product_hightlight},
    product_status = ${product_status}
     WHERE id = ${id}`,
    function (error, results, fields) {
      if (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Failed to update product" });
      }
      res.status(200).json({ message: "Product updated successfully" });
    }
  );
});

router.delete("/delete", function (req, res, next) {
  const product_id = req.body.product_id;
  connection.query(
    `DELETE FROM product WHERE id = '${product_id}'`,
    function (error, results, fields) {
      if (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Failed to delete product" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    }
  );
});

router.post("/add", function (req, res, next) {
  const {
    itemname,
    price,
    des,
    product,
    product_image,
    category_name,
    product_hightlight,
    product_status,
  } = req.body;
  connection.query(
    `INSERT INTO product (itemname, price, des, product, product_image, category_name, product_hightlight, product_status) 
     VALUES ('${itemname}', ${price}, '${des}', '${product}',  '${product_image}', '${category_name}', '${product_hightlight}', '${product_status}')`,
    function (error, results, fields) {
      if (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ message: "Failed to add product" });
      }
      res.status(200).json({ message: "Product added successfully" });
    }
  );
});

router.post("/buy", function (req, res, next) {
  const { username, itemname, amount, product, price } = req.body;

  // ตรวจสอบว่ามีชื่อผู้ใช้งานหรือไม่
  connection.query(
    `SELECT * FROM user WHERE username = ?`,
    [username],
    function (error, results, fields) {
      if (error) {
        console.error("เกิดข้อผิดพลาดในการตรวจสอบชื่อผู้ใช้:", error);
        return res
          .status(200)
          .json({ message: "ไม่สามารถตรวจสอบชื่อผู้ใช้ได้" });
      }
      if (results.length === 0) {
        return res.status(200).json({ message: "ชื่อผู้ใช้ไม่มีอยู่ในระบบ" });
      }
      const user = results[0];

      // ตรวจสอบว่าผู้ใช้มียอดเงินเพียงพอหรือไม่
      if (user.point < price * amount) {
        return res.status(200).json({ message: "ยอดเงินไม่เพียงพอ" });
      }

      // ตรวจสอบว่ามีสินค้าหรือไม่
      connection.query(
        `SELECT * FROM product WHERE itemname = ?`,
        [itemname],
        function (error, results, fields) {
          if (error) {
            console.error("เกิดข้อผิดพลาดในการตรวจสอบชื่อสินค้า:", error);
            return res
              .status(500)
              .json({ message: "ไม่สามารถตรวจสอบชื่อสินค้าได้" });
          }
          if (results.length === 0) {
            return res
              .status(400)
              .json({ message: "ชื่อสินค้าไม่มีอยู่ในระบบ" });
          }
          const product = results[0];
          const productArray = product.product
            .split("\n")
            .filter((item) => item.trim() !== ""); // แปลงสตริงเป็นอาร์เรย์และกรองออกเฉพาะรายการที่ไม่ใช่ช่องว่าง
          const updatedProduct = []; // สร้างอาร์เรย์เปล่าเพื่อเก็บข้อมูลสินค้าที่จะอัปเดต
          
          for (let i = 0; i < amount; i++) {
            if (productArray.length > 0) {
              // ตรวจสอบว่ายังมีสินค้าในอาร์เรย์หรือไม่
              updatedProduct.push(productArray.shift()); // เอาสินค้าตามจำนวน amount จากอาร์เรย์แล้วนำไปใส่ใน updatedProduct ด้วยเมท็อด shift()
            } else {
              break; // ถ้าไม่มีสินค้าในอาร์เรย์แล้วให้หยุดลูป
            }
          }
          if (updatedProduct.length < amount) {
            return res.status(200).json({ message: "สินค้าไม่เพียงพอ" });
          }

          // อัปเดตจำนวนสินค้าที่เหลือ
          connection.query(
            `UPDATE product SET product = ? WHERE itemname = ?`,
            [productArray.join("\n"), itemname], // รวม productArray ให้เป็นสตริง โดยแยกด้วย "\n"
            function (error, results, fields) {
              if (error) {
                console.error("เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า:", error);
                return res
                  .status(500)
                  .json({ message: "ไม่สามารถอัปเดตจำนวนสินค้าได้" });
              }
            });
            const total_price = price * amount;
          // อัปเดตยอดเงินของผู้ใช้
          connection.query(
            `UPDATE user SET point = point - ? WHERE username = ?`,
            [price * amount, username],
            function (error, results, fields) {
              if (error) {
                console.error("เกิดข้อผิดพลาดในการอัปเดตยอดเงิน:", error);
                return res
                  .status(500)
                  .json({ message: "ไม่สามารถอัปเดตยอดเงินได้" });
              }
              // เพิ่มประวัติการซื้อ
                connection.query(
                  `INSERT INTO history_buy (username, itemname, amount, product, total_price, product_image) VALUES (?, ?, ?, ?, ?, ?)`,
                  [username, itemname, amount, updatedProduct.join("\n"), total_price, product.product_image],
                function (error, results, fields) {
                  if (error) {
                    console.error(
                      "เกิดข้อผิดพลาดในการเพิ่มประวัติการซื้อ:",
                      error
                    );
                    return res
                      .status(500)
                      .json({ message: "ไม่สามารถเพิ่มประวัติการซื้อได้" });
                  }
                  // ส่งข้อมูลการสั่งซื้อและข้อมูลผู้ใช้และสินค้ากลับ
                  res.status(200).json({
                    statusCode: "200",
                    message: "การสั่งซื้อสำเร็จ",
                    user: {
                      username: user.username,
                      point: user.point - price * amount,
                    },
                    product: {
                      itemname: product.itemname,
                      price: product.price,
                      des: product.des,
                      product: updatedProduct,
                      category_name: product.category_name,
                    },
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;
