const Campground = require("../models/campground");
const Review = require("../models/campground.js")


module.exports.createReview = async (req, res, next) => {
    console.log(req.params);
    console.log(req.body);
    const camp = await Campground.findById(req.params.id);
    const { review, rating } = req.body.review;
    const ins = new Review({ review, rating });
    camp.reviews.push(ins)
    await ins.save();
    await camp.save();
    res.redirect(`/camps/${camp._id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/camps/${id}`);

}