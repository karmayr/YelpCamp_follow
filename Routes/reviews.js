const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Campground = require("../models/campground.js")
const Review = require("../models/campground.js")
const { reviewJoiSchema } = require("../joiSchemas/Schemas.js");

const reviews = require("../controllers/reviews.js");


const validateJoiReviews = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        throw new AppError(error.details.map(elem => elem.message).join(","), 400);
    }
    else {
        next();
    }
}

router.post("/", validateJoiReviews, catchAsync(reviews.createReview))

router.delete("/:reviewID", catchAsync(reviews.deleteReview))

module.exports = router;