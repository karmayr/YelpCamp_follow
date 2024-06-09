const Campground = require("../models/campground.js");
const Review = require("../models/review.js");
const AppError = require("../utils/appError");
const { campgroundJoiSchema } = require("../joiSchemas/Schemas.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', "Login first");
        res.redirect('/login');
    } else {
        next();
    }
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.validateJoiCampground = (req, res, next) => {
    // console.log(campgroundJoiSchema);
    const { error } = campgroundJoiSchema.validate(req.body);
    if (error) {
        throw new AppError(error.details.map(elem => elem.message).join(","), 400);
    } else {
        next();
    }
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to so this');
        return res.redirect(`/camps/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to so this');
        return res.redirect(`/camps/${id}`);
    }
    next();
}