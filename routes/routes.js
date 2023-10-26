const express = require("express");
const multer = require('multer');
const path = require('path');

const {
    carouselController,
    storeCarouselController
} = require("../controller/carousel.controller");

const router = express.Router();

// Set up multer storage for saving files to the "images" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'images'); // The "images" folder
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

//router to handle root path that returns a simple message
router.get("/", (req, res) => {
  res.send("API is running");
});

router.get("/api/carousel",carouselController);
router.post("/api/carousel/store",upload.single('image'), storeCarouselController);


module.exports = {
  routes: router,
};
