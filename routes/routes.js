const express = require("express");
const uploadImage = require("../middleware/uploadImage");

const {
    carouselController,
    storeCarouselController
} = require("../controller/carousel.controller");

const router = express.Router();

//router to handle root path that returns a simple message
router.get("/", (req, res) => {
  res.send("API is running");
});

router.get("/api/carousel",carouselController);
router.post("/api/carousel/store",uploadImage.single('image'), storeCarouselController);


module.exports = {
  routes: router,
};
