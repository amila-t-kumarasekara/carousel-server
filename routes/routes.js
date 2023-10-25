const express = require("express");

const {
    carouselController
} = require("../controller/carousel.controller");

const router = express.Router();

//router to handle root path that returns a simple message
router.get("/", (req, res) => {
  res.send("API is running");
});

router.get("/api/carousel",carouselController);


module.exports = {
  routes: router,
};
