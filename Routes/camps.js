const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground.js")
const router = express.Router();
const { isLoggedIn, validateJoiCampground, isAuthor } = require("../utils/middleware");
const campgrounds = require("../controllers/camprgrounds");
const { storage } = require("../cloudinary/app.js");
//multer
const multer = require('multer')
const upload = multer({ storage })

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateJoiCampground, catchAsync(campgrounds.createNewCamp));

router.get("/create", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showOneCamp))
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.updateCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp))


router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.editCamp));

// router.get("/", catchAsync(campgrounds.index));
// router.post("/", isLoggedIn, validateJoiCampground, catchAsync(campgrounds.createNewCamp));
// router.get("/:id", catchAsync(campgrounds.showOneCamp));
// router.put("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.updateCamp));
// router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

module.exports = router;