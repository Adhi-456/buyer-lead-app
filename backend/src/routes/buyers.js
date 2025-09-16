const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  getBuyers,
  createBuyer,
  exportBuyers,
  importBuyers
} = require("../controllers/buyersController");

router.get("/", getBuyers);
router.post("/", createBuyer);
router.get("/export", exportBuyers);

// CSV Import (upload file)
router.post("/import", upload.single("file"), importBuyers);

module.exports = router;
